"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useLearning } from "@/context/LearningContext";
import AITeacherCard from "@/components/learning/AITeacherCard";
import AskMayaInput from "@/components/learning/AskMayaInput";

class PCMPlayer {
  audioContext: AudioContext;
  nextStartTime: number;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.nextStartTime = 0;
  }
  
  playChunk(base64Data: string) {
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for(let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768.0;
    }
    
    const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);
    
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    
    const currentTime = this.audioContext.currentTime;
    if (this.nextStartTime < currentTime) {
       this.nextStartTime = currentTime + 0.1;
    }
    source.start(this.nextStartTime);
    this.nextStartTime += audioBuffer.duration;
  }
}

function downsampleBuffer(buffer: Float32Array, inRate: number, outRate: number): Float32Array {
  if (outRate === inRate) {
    return buffer;
  }
  if (outRate > inRate) {
    throw new Error("Downsampling rate should be smaller than original sample rate");
  }
  const sampleRateRatio = inRate / outRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / (count || 1);
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

export default function MayaPanel() {
  const { studentName, studentGrade, activeTopic, chatMessages, addChatMessage } = useLearning();

  // Panel open/close and modes states
  const [isOpen, setIsOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"choice" | "voice" | "text">("choice");
  const [activeUserTranscription, setActiveUserTranscription] = useState("");
  const [activeAITranscription, setActiveAITranscription] = useState("");
  const [displayedAIText, setDisplayedAIText] = useState("");

  // Unread indicator — bump whenever a new AI message arrives while panel is closed
  const [unreadCount, setUnreadCount] = useState(0);
  const prevMsgCount = useRef(chatMessages.length);

  // Live Voice States
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [isVoiceConnecting, setIsVoiceConnecting] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [interimUserText, setInterimUserText] = useState("");

  const ws = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioInputRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<AudioWorkletNode | null>(null);
  const pcmPlayerRef = useRef<PCMPlayer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const runningAITranscript = useRef("");

  useEffect(() => {
    if (chatMessages.length > prevMsgCount.current) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (!isOpen && lastMsg?.sender === "AI") {
        setUnreadCount((n) => n + 1);
      }
    }
    prevMsgCount.current = chatMessages.length;
  }, [chatMessages, isOpen]);

  // Clear unread and reset mode when panel opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      if (isVoiceActive) {
        setPanelMode("voice");
      } else {
        setPanelMode("choice");
      }
    }
  }, [isOpen, isVoiceActive]);

  // Scroll chat to bottom on every new message
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen]);

  // Smooth typewriter streaming transcription effect
  useEffect(() => {
    if (!activeAITranscription) {
      setDisplayedAIText("");
      return;
    }
    
    if (activeAITranscription === "thinking...") {
      setDisplayedAIText("thinking...");
      return;
    }

    let index = displayedAIText.length;
    
    if (activeAITranscription.length < displayedAIText.length) {
      setDisplayedAIText(activeAITranscription.substring(0, 1));
      index = 1;
    }

    const interval = setInterval(() => {
      if (index < activeAITranscription.length) {
        setDisplayedAIText(activeAITranscription.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20); // 20ms per character typing speed

    return () => clearInterval(interval);
  }, [activeAITranscription]);

  const TypingIndicator = () => (
    <div className="flex items-center gap-1.5 py-2">
      <div className="typing-dot typing-dot-1" />
      <div className="typing-dot typing-dot-2" />
      <div className="typing-dot typing-dot-3" />
    </div>
  );

  // ── Drag-to-close on mobile ─────────────────────────────────────────────
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const currentDragDelta = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    currentDragDelta.current = 0;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta < 0) return; // only drag downward
    currentDragDelta.current = delta;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = "";
      sheetRef.current.style.transform = "";
    }
    if (currentDragDelta.current > 120) {
      setIsOpen(false);
    }
    dragStartY.current = null;
    currentDragDelta.current = 0;
  }, []);

  // ── Message send ────────────────────────────────────────────────────────
  const handleSend = (text: string) => {
    addChatMessage(text, "USER");
  };

  // ── Backdrop click closes panel ─────────────────────────────────────────
  const handleBackdropClick = () => setIsOpen(false);

  const startVoiceConnection = async () => {
    // Guard: prevent multiple simultaneous connections
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket already active, skipping duplicate connection.");
      return;
    }

    try {
      setVoiceError(null);
      setIsVoiceConnecting(true);
      // setIsVoiceActive(true); // will be set after successful init

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.hostname}:3002?name=${encodeURIComponent(studentName)}&grade=${encodeURIComponent(studentGrade)}&topic=${encodeURIComponent(activeTopic)}`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = async () => {
        console.log("[Client] WebSocket connection established successfully!");
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          
          console.log("[Client] Initializing playback AudioContext...");
          const playbackContext = new AudioContextClass();
          if (playbackContext.state === "suspended") {
            console.log("[Client] Resuming suspended playback context...");
            await playbackContext.resume();
          }
          pcmPlayerRef.current = new PCMPlayer(playbackContext);

          console.log("[Client] Initializing recording AudioContext...");
          let recordingContext: AudioContext;
          try {
            console.log("[Client] Trying to create recording AudioContext at 16000Hz...");
            recordingContext = new AudioContextClass({ sampleRate: 16000 });
            console.log("[Client] Created recording context at 16000Hz");
          } catch (audioCtxError) {
            console.warn("[Client] Could not create AudioContext at 16000Hz. Retrying with default sample rate...", audioCtxError);
            recordingContext = new AudioContextClass();
            console.log("[Client] Created recording context at default sample rate:", recordingContext.sampleRate);
          }

          if (recordingContext.state === "suspended") {
            console.log("[Client] Resuming suspended recording context...");
            await recordingContext.resume();
          }
          audioContextRef.current = recordingContext;

          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setVoiceError("Mic API is disabled. Open http://localhost:3000 strictly.");
            stopVoiceConnection();
            return;
          }

          console.log("[Client] Requesting microphone access...");
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;

          console.log("[Client] Microphone stream acquired successfully!");
          audioInputRef.current = recordingContext.createMediaStreamSource(stream);
           
          console.log("[Client] Creating ScriptProcessorNode...");
          const scriptNode = recordingContext.createScriptProcessor(2048, 1, 1);
          processorRef.current = scriptNode as unknown as AudioWorkletNode;

          let chunksSent = 0;
          scriptNode.onaudioprocess = (audioProcessingEvent) => {
            if (ws.current?.readyState === WebSocket.OPEN) {
              const inputBuffer = audioProcessingEvent.inputBuffer;
              const rawData = inputBuffer.getChannelData(0);

              // Downsample dynamically from source rate to 16kHz
              const channelData = downsampleBuffer(rawData, recordingContext.sampleRate, 16000);

              // Convert Float32 raw audio to Int16 PCM data
              const pcmData = new Int16Array(channelData.length);
              for (let i = 0; i < channelData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, channelData[i])) * 32767;
              }

              // Convert PCM buffer to base64
              const bytes = new Uint8Array(pcmData.buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = btoa(binary);

              ws.current.send(JSON.stringify({ audio: base64 }));
              chunksSent++;
              if (chunksSent % 50 === 0) {
                console.log(`[Client] Sent ${chunksSent} audio chunks to server.`);
              }
            }
          };

          audioInputRef.current.connect(processorRef.current);
          processorRef.current.connect(recordingContext.destination);
          
          setIsVoiceConnected(true);
          setIsVoiceConnecting(false);
          setIsVoiceActive(true); // mark active after init
          console.log("[Client] Voice pipeline is fully active!");
        } catch (err: unknown) {
          console.error("[Client] Voice call audio init error:", err);
          const errorMsg = err instanceof Error ? err.message : String(err);
          window.alert("Voice Call Error: " + errorMsg);
          setVoiceError("Audio initialization failed: " + errorMsg);
          stopVoiceConnection();
        }
      };

      ws.current.onmessage = (event) => {
        console.log("[Client] Received WS message (preview):", event.data.substring(0, 150));
        const data = JSON.parse(event.data);

        if (data.audio && pcmPlayerRef.current) {
          pcmPlayerRef.current.playChunk(data.audio);
        }

        if (data.interimInputTranscription) {
          setInterimUserText(data.interimInputTranscription);
          setActiveUserTranscription(data.interimInputTranscription);
        }

        if (data.inputTranscription) {
          setInterimUserText("");
          setActiveUserTranscription(data.inputTranscription);
          setActiveAITranscription("thinking...");
          runningAITranscript.current = "";
          addChatMessage(data.inputTranscription, "USER");
        }

        if (data.outputTranscription) {
          setActiveAITranscription(data.outputTranscription);
          runningAITranscript.current = data.outputTranscription;
        }

        if (data.turnComplete) {
          if (runningAITranscript.current) {
            addChatMessage(runningAITranscript.current, "AI");
            runningAITranscript.current = "";
          }
        }

        if (data.interrupted) {
          if (runningAITranscript.current) {
            addChatMessage(runningAITranscript.current + "...", "AI");
            runningAITranscript.current = "";
          }
        }

        if (data.error) {
          console.error("[Client] Received error from server:", data.error);
          setVoiceError("Server error: " + data.error);
        }
      };

      ws.current.onclose = (e) => {
        console.log("[Client] WebSocket closed:", e.code, e.reason);
        stopVoiceConnection();
      };

      ws.current.onerror = (err) => {
        console.error("[Client] WebSocket error event:", err);
        setVoiceError("Connection error.");
        stopVoiceConnection();
      };
    } catch (err) {
      console.error("startVoiceConnection error", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setVoiceError("Failed to connect: " + errorMsg);
      stopVoiceConnection();
    }
  };

  const stopVoiceConnection = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioInputRef.current) {
      audioInputRef.current.disconnect();
      audioInputRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (pcmPlayerRef.current) {
      pcmPlayerRef.current.audioContext.close();
      pcmPlayerRef.current = null;
    }
    setIsVoiceConnected(false);
    setIsVoiceConnecting(false);
    setIsVoiceActive(false);
    setInterimUserText("");
    setActiveUserTranscription("");
    setActiveAITranscription("");
  };

  return (
    <>
      {/* ── Backdrop (mobile only, behind sheet) ───────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* ── Desktop right-side slide-over panel ────────────────────────── */}
      <aside
        className={`
          hidden md:flex md:flex-col
          fixed top-0 right-0 h-full w-[35%] z-50
          bg-white border-l border-outline-variant/15
          shadow-[-20px_0_60px_rgba(83,65,205,0.08)]
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Desktop Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {panelMode !== "choice" && (
              <button
                onClick={() => {
                  if (panelMode === "voice" && isVoiceActive) {
                    stopVoiceConnection();
                  }
                  setPanelMode("choice");
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
                title="Go Back"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_back</span>
              </button>
            )}
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">
                {panelMode === "choice" ? "Ask Maya" : panelMode === "voice" ? "Maya Live Call" : "Maya Text Chat"}
              </p>
              <p className="text-[10px] text-on-surface-variant font-medium">AI Teaching Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Desktop Voice Error Banner */}
        {voiceError && (
          <div className="bg-rose-50 border-b border-rose-100 px-5 py-3 flex items-center justify-between shrink-0">
            <span className="text-xs text-rose-600 font-medium">{voiceError}</span>
            <button onClick={() => setVoiceError(null)} className="text-rose-400 hover:text-rose-600 text-xs">Clear</button>
          </div>
        )}

        {/* Desktop Dynamic Body Modes */}
        {panelMode === "choice" && (
          <div className="flex-1 p-6 flex flex-col justify-center gap-6 bg-[#f8f9ff]">
            <div className="text-center mb-2">
              <h3 className="font-bold text-base text-on-surface">How would you like to study?</h3>
              <p className="text-xs text-on-surface-variant mt-2 px-4 leading-relaxed">
                Select voice to talk live, or text to type questions and view explanations.
              </p>
            </div>

            {/* Voice Mode Card */}
            <div
              onClick={async () => {
                setPanelMode("voice");
                await startVoiceConnection();
              }}
              className="bg-white p-6 rounded-3xl border border-outline-variant/15 hover:border-primary/45 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                <span className="material-symbols-outlined text-[28px]">mic</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Call Maya (Voice)</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Talk in real-time, get age-appropriate voice explanations.</p>
              </div>
            </div>

            {/* Text Mode Card */}
            <div
              onClick={() => setPanelMode("text")}
              className="bg-white p-6 rounded-3xl border border-outline-variant/15 hover:border-secondary/45 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-5 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shrink-0">
                <span className="material-symbols-outlined text-[28px]">chat</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-on-surface group-hover:text-secondary transition-colors">Chat Assistant (Text)</h4>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">Type your questions, browse history, read tutor cards.</p>
              </div>
            </div>
          </div>
        )}

        {panelMode === "voice" && (
          <div className="flex-1 p-6 flex flex-col justify-between bg-[#0b0a14] text-white">
            {/* Visualizer Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="relative w-28 h-28 flex items-center justify-center mb-8">
                {isVoiceConnected && <div className="live-glow-ring" />}
                {isVoiceConnecting && <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-ping" />}
                
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shadow-lg border border-primary/40 relative z-10 overflow-hidden">
                  <span className="material-symbols-outlined text-white text-[48px] animate-pulse">psychology</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest text-center mt-2">
                {isVoiceConnected ? "Maya is listening..." : isVoiceConnecting ? "Connecting..." : "Call Inactive"}
              </p>

              {/* Jumping waveforms */}
              {isVoiceConnected && (
                <div className="wave-container mt-6">
                  <div className="wave-bar wave-bar-1" />
                  <div className="wave-bar wave-bar-2" />
                  <div className="wave-bar wave-bar-3" />
                  <div className="wave-bar wave-bar-4" />
                  <div className="wave-bar wave-bar-5" />
                  <div className="wave-bar wave-bar-6" />
                  <div className="wave-bar wave-bar-7" />
                </div>
              )}
            </div>

            {/* Current exchange card */}
            {(activeUserTranscription || activeAITranscription) && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-8 space-y-4 max-h-[40%] overflow-y-auto backdrop-blur-md">
                {activeUserTranscription && (
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">You said</p>
                    <p className="text-sm text-slate-200 leading-relaxed italic">"{activeUserTranscription}"</p>
                  </div>
                )}
                {activeAITranscription && (
                  <div className="text-left border-t border-white/5 pt-3">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Maya</p>
                    <div className="text-sm text-slate-100 leading-relaxed font-medium">
                      {activeAITranscription === "thinking..." ? (
                        <TypingIndicator />
                      ) : (
                        displayedAIText
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Call Controls */}
            <div className="flex justify-center pb-4 shrink-0">
              <button
                onClick={() => {
                  stopVoiceConnection();
                  setPanelMode("choice");
                }}
                className="w-16 h-16 rounded-full bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all shadow-lg flex items-center justify-center cursor-pointer"
                title="End Call"
              >
                <span className="material-symbols-outlined text-[28px]">call_end</span>
              </button>
            </div>
          </div>
        )}

        {panelMode === "text" && (
          <>
            {/* Desktop chat messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <AITeacherCard
                studentName={studentName}
                messageText={`Great work conceptualizing ${activeTopic}! I'm here if you have any questions as you progress through the steps.`}
              />
              {chatMessages.slice(1).map((msg) => {
                const isAI = msg.sender === "AI";
                return (
                  <div key={msg.id} className={`flex gap-3 items-start ${isAI ? "" : "flex-row-reverse"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isAI ? "bg-primary-container text-white" : "bg-secondary text-white"
                    }`}>
                      <span className="material-symbols-outlined text-[16px]">{isAI ? "psychology" : "person"}</span>
                    </div>
                    <div className={`p-4 rounded-2xl border text-xs max-w-[80%] leading-relaxed ${
                      isAI
                        ? "bg-slate-50 border-outline-variant/10 rounded-tl-none text-on-surface"
                        : "bg-primary text-white border-transparent rounded-tr-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Desktop input */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <AskMayaInput onSendMessage={handleSend} onQuickQuestion={handleSend} />
            </div>
          </>
        )}
      </aside>

      {/* ── Mobile bottom sheet ─────────────────────────────────────────── */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          md:hidden
          fixed bottom-0 left-0 right-0 z-50
          bg-white rounded-t-3xl
          shadow-[0_-20px_60px_rgba(83,65,205,0.15)]
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          h-[80dvh]
        `}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Mobile Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {panelMode !== "choice" && (
              <button
                onClick={() => {
                  if (panelMode === "voice" && isVoiceActive) {
                    stopVoiceConnection();
                  }
                  setPanelMode("choice");
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">arrow_back</span>
              </button>
            )}
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">
                {panelMode === "choice" ? "Ask Maya" : panelMode === "voice" ? "Maya Live Call" : "Maya Text Chat"}
              </p>
              <p className="text-[10px] text-on-surface-variant font-medium">AI Teaching Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Mobile Voice Error Banner */}
        {voiceError && (
          <div className="bg-rose-50 border-b border-rose-100 px-5 py-2.5 flex items-center justify-between text-[11px] shrink-0">
            <span className="text-rose-600 font-medium">{voiceError}</span>
            <button onClick={() => setVoiceError(null)} className="text-rose-400 hover:text-rose-600 text-[10px]">Clear</button>
          </div>
        )}

        {/* Mobile Dynamic Body Modes */}
        {panelMode === "choice" && (
          <div className="flex-1 p-5 flex flex-col justify-center gap-5 bg-[#f8f9ff]">
            <div className="text-center mb-2">
              <h3 className="font-bold text-base text-on-surface">How would you like to study?</h3>
              <p className="text-xs text-on-surface-variant mt-2 px-2 leading-relaxed">
                Select voice to talk live, or text to type questions and view explanations.
              </p>
            </div>

            {/* Voice Card */}
            <div
              onClick={async () => {
                setPanelMode("voice");
                await startVoiceConnection();
              }}
              className="bg-white p-5 rounded-3xl border border-outline-variant/15 hover:border-primary/45 shadow-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                <span className="material-symbols-outlined text-[24px]">mic</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Call Maya (Voice)</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">Talk in real-time, get voice explanations.</p>
              </div>
            </div>

            {/* Text Card */}
            <div
              onClick={() => setPanelMode("text")}
              className="bg-white p-5 rounded-3xl border border-outline-variant/15 hover:border-secondary/45 shadow-sm transition-all active:scale-[0.98] cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shrink-0">
                <span className="material-symbols-outlined text-[24px]">chat</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-on-surface group-hover:text-secondary transition-colors">Chat Assistant (Text)</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">Type your questions, browse history, read cards.</p>
              </div>
            </div>
          </div>
        )}

        {panelMode === "voice" && (
          <div className="flex-1 p-5 flex flex-col justify-between bg-[#0b0a14] text-white">
            {/* Visualizer Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                {isVoiceConnected && <div className="live-glow-ring" />}
                {isVoiceConnecting && <div className="absolute inset-0 border border-amber-500/30 rounded-full animate-ping" />}
                
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shadow-lg border border-primary/40 relative z-10 overflow-hidden">
                  <span className="material-symbols-outlined text-white text-[38px] animate-pulse">psychology</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest text-center mt-2">
                {isVoiceConnected ? "Maya is listening..." : isVoiceConnecting ? "Connecting..." : "Call Inactive"}
              </p>

              {/* Jumping waveforms */}
              {isVoiceConnected && (
                <div className="wave-container mt-6">
                  <div className="wave-bar wave-bar-1" />
                  <div className="wave-bar wave-bar-2" />
                  <div className="wave-bar wave-bar-3" />
                  <div className="wave-bar wave-bar-4" />
                  <div className="wave-bar wave-bar-5" />
                  <div className="wave-bar wave-bar-6" />
                  <div className="wave-bar wave-bar-7" />
                </div>
              )}
            </div>

            {/* Current exchange card */}
            {(activeUserTranscription || activeAITranscription) && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 space-y-3 max-h-[40%] overflow-y-auto backdrop-blur-md">
                {activeUserTranscription && (
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">You said</p>
                    <p className="text-xs text-slate-200 leading-relaxed italic">"{activeUserTranscription}"</p>
                  </div>
                )}
                {activeAITranscription && (
                  <div className="text-left border-t border-white/5 pt-2">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">Maya</p>
                    <div className="text-xs text-slate-100 leading-relaxed font-medium">
                      {activeAITranscription === "thinking..." ? (
                        <TypingIndicator />
                      ) : (
                        displayedAIText
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Call Controls */}
            <div className="flex justify-center pb-3 shrink-0">
              <button
                onClick={() => {
                  stopVoiceConnection();
                  setPanelMode("choice");
                }}
                className="w-14 h-14 rounded-full bg-rose-600 text-white hover:bg-rose-700 active:scale-95 transition-all shadow-lg flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">call_end</span>
              </button>
            </div>
          </div>
        )}

        {panelMode === "text" && (
          <>
            {/* Mobile chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AITeacherCard
                studentName={studentName}
                messageText={`Great work conceptualizing ${activeTopic}! I'm here if you have any questions as you progress through the steps.`}
              />
              {chatMessages.slice(1).map((msg) => {
                const isAI = msg.sender === "AI";
                return (
                  <div key={msg.id} className={`flex gap-3 items-start ${isAI ? "" : "flex-row-reverse"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isAI ? "bg-primary-container text-white" : "bg-secondary text-white"
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">{isAI ? "psychology" : "person"}</span>
                    </div>
                    <div className={`p-3 rounded-2xl border text-xs max-w-[82%] leading-relaxed ${
                      isAI
                        ? "bg-slate-50 border-outline-variant/10 rounded-tl-none text-on-surface"
                        : "bg-primary text-white border-transparent rounded-tr-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Mobile input */}
            <div className="px-4 pt-3 pb-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <AskMayaInput onSendMessage={handleSend} onQuickQuestion={handleSend} />
            </div>
          </>
        )}
      </div>

      {/* ── Floating "Ask Maya" FAB ─────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Ask Maya AI assistant"
        className={`
          fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50
          flex items-center gap-2.5
          bg-primary text-white
          shadow-[0_8px_30px_rgba(83,65,205,0.45)]
          rounded-full
          px-5 py-3.5
          font-bold text-sm
          transition-all duration-300 ease-out
          active:scale-95 hover:shadow-[0_12px_40px_rgba(83,65,205,0.55)]
          cursor-pointer select-none
          ${isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}
        `}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          psychology
        </span>
        <span>Ask Maya</span>

        {/* Unread indicator badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}

