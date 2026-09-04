import { createServer } from "http";
import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("[Server] Starting Voice Server...");
console.log("[Server] Directory:", __dirname);
console.log("[Server] GEMINI_API_KEY loaded?:", !!process.env.GEMINI_API_KEY);

const port = 3002;
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Voice server is active\n");
});

const wss = new WebSocketServer({ noServer: true });

let aiClient = null;

function getAI(keyOverride) {
  const apiKey = keyOverride || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({ apiKey });
}

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", async (clientWs, request) => {
  console.log("New client connected via WebSocket to Standalone Audio Server");

  const reqUrl = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
  const studentName = reqUrl.searchParams.get("name") || "Student";
  const studentGrade = reqUrl.searchParams.get("grade") || "Grade 5";
  const activeTopic = reqUrl.searchParams.get("topic") || "Topic";
  const activeChapter = reqUrl.searchParams.get("chapter") || "Chapter";
  const locale = reqUrl.searchParams.get("locale") === "hi-IN" ? "hi-IN" : "en-IN";
  const responseLanguage = locale === "hi-IN" ? "Hindi using Devanagari script" : "English";
  console.log(`[Server] Session details: Student: ${studentName}, Grade: ${studentGrade}, Chapter: ${activeChapter}, Topic: ${activeTopic}, Language: ${locale}`);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    clientWs.send(JSON.stringify({ error: "GEMINI_API_KEY is not configured on standalone server." }));
    clientWs.close();
    return;
  }

  let geminiSession = null;
  let clientClosed = false;

  try {
    console.log("Connecting to Gemini Live API...");

    const candidateKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2
    ].filter(Boolean);

    const candidateModels = [
      process.env.GEMINI_LIVE_MODEL || "gemini-2.0-flash-exp",
      "gemini-2.0-flash-exp",
      "gemini-2.0-flash-realtime-exp"
    ];

    let connectedModel = null;

    for (const keyCandidate of candidateKeys) {
      const ai = getAI(keyCandidate);
      for (const modelCandidate of candidateModels) {
        try {
          geminiSession = await ai.live.connect({
            model: modelCandidate,
            config: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede"
                  }
                }
              },
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction: `You are Maya, a professional, friendly, and helpful real-time AI teaching assistant.
You are talking to a student named ${studentName} who is in ${studentGrade}.
The active chapter is "${activeChapter}" and the active topic is "${activeTopic}".

TEACHING GUIDELINES:
1. Speak strictly in clear, friendly ${responseLanguage} with a warm, natural tone suitable for a school student.
2. Start by greeting ${studentName} and introducing the chapter "${activeChapter}" and topic "${activeTopic}".
3. Explain the first small basic concept of "${activeTopic}" step-by-step.
4. Immediately ask a simple question in ${responseLanguage} to check ${studentName}'s understanding.
5. NEVER give the direct answer to any problem. Guide the student Socratically.
6. Keep your answers brief, engaging, and highly conversational.`
            },
            callbacks: {
              onmessage: (message) => {
                try {
                  const payload = {};
                  const audio = message.data;
                  if (audio) {
                    payload.audio = audio;
                  }

                  const interimInput = message.serverContent?.interimInputTranscription?.text;
                  const inputTranscription = message.serverContent?.inputTranscription?.text;
                  const outputTranscription = message.serverContent?.outputTranscription?.text;

                  if (interimInput) payload.interimInputTranscription = interimInput;
                  if (inputTranscription) payload.inputTranscription = inputTranscription;
                  if (outputTranscription) payload.outputTranscription = outputTranscription;

                  if (message.serverContent?.interrupted) {
                    payload.interrupted = true;
                  }
                  if (message.serverContent?.turnComplete) {
                    payload.turnComplete = true;
                  }

                  if (Object.keys(payload).length > 0 && clientWs.readyState === 1) {
                    clientWs.send(JSON.stringify(payload));
                  }
                } catch (err) {
                  console.error("Error parsing Gemini message callback:", err);
                }
              },
              onclose: (event) => {
                if (clientClosed) {
                  console.log("[INFO] Gemini session closed because browser disconnected first.");
                } else {
                  console.log("[WARN] Gemini Live session ended. Code:", event?.code, "Reason:", event?.reason || "(no reason)");
                }
                if (clientWs.readyState === 1) {
                  let friendlyError = "Gemini Live Voice is unavailable on your API key/tier. Text chat is active!";
                  if (event?.code === 1008) {
                    friendlyError = "Gemini Live Audio API requires a Pay-as-you-go / Google Cloud key. Standard Text Chat & Speech remain fully active.";
                  }
                  clientWs.send(JSON.stringify({ error: friendlyError, closed: true }));
                }
              },
              onerror: (err) => {
                console.error("Gemini Live API error:", err);
                if (clientWs.readyState === 1) {
                  clientWs.send(JSON.stringify({ error: err.message || "Gemini Session Error" }));
                }
              }
            }
          });
          connectedModel = modelCandidate;
          break;
        } catch (connErr) {
          console.warn(`[Server] Live connect attempt with ${modelCandidate} failed:`, connErr?.message || connErr);
        }
      }
      if (geminiSession) break;
    }

    if (!geminiSession) {
      throw new Error("None of the Gemini Live candidate models could be connected.");
    }

    console.log("Connected successfully to Gemini Live API");
    if (clientWs.readyState === 1) {
      clientWs.send(JSON.stringify({ connected: true }));
    }

    if (geminiSession) {
      const greetingPrompt = `Greet ${studentName} naturally in ${responseLanguage}. Then briefly introduce the first concept of "${activeTopic}" and ask one simple question to test understanding.`;
      geminiSession.sendRealtimeInput({
        text: greetingPrompt
      });
    }
  } catch (err) {
    console.error("Failed to connect to Gemini Live:", err);
    if (clientWs.readyState === 1) {
      clientWs.send(JSON.stringify({ error: "Failed to establish a Live session: " + (err.message || err) }));
      clientWs.close();
    }
    return;
  }

  clientWs.on("message", (rawData) => {
    try {
      const parsed = JSON.parse(rawData.toString());

      if (!geminiSession) {
        console.warn("Client message received but Gemini session is not ready.");
        return;
      }

      if (parsed.audio) {
        geminiSession.sendRealtimeInput({
          audio: {
            data: parsed.audio,
            mimeType: "audio/pcm;rate=16000"
          }
        });
      } else if (parsed.text) {
        geminiSession.sendRealtimeInput({
          text: parsed.text
        });
      }
    } catch (err) {
      console.error("Error parsing/relaying client message:", err);
    }
  });

  clientWs.on("close", (code, reason) => {
    clientClosed = true;
    console.log(`[INFO] Browser WebSocket closed. Code: ${code}, Reason: ${reason?.toString() || "(none)"}`);
    if (geminiSession) {
      try {
        geminiSession.close();
      } catch (_) { }
    }
  });
});

server.listen(port, () => {
  console.log(`> Standalone WebSocket Audio Server ready on ws://localhost:${port}`);
});
