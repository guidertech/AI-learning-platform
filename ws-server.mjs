import { createServer } from "http";
import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const port = 3002;
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Voice server is active\n");
});

const wss = new WebSocketServer({ noServer: true });

let aiClient = null;

function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", async (clientWs, request) => {
  console.log("New client connected via WebSocket to Standalone Audio Server");

  const reqUrl = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
  const studentName = reqUrl.searchParams.get("name") || "Maya";
  const studentGrade = reqUrl.searchParams.get("grade") || "Grade 5";
  const activeTopic = reqUrl.searchParams.get("topic") || "Fractions";

  console.log(`[Server] Session details: Student: ${studentName}, Grade: ${studentGrade}, Topic: ${activeTopic}`);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    clientWs.send(JSON.stringify({ error: "GEMINI_API_KEY is not configured on standalone server." }));
    clientWs.close();
    return;
  }

  let geminiSession = null;
  let clientClosed = false;

  try {
    const ai = getAI();
    console.log("Connecting to Gemini Live API...");

    geminiSession = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Aoede"
            }
          }
        },
        systemInstruction: `You are Maya, a professional, friendly, and helpful real-time AI teaching assistant.
You are talking to a student named ${studentName} who is in ${studentGrade}.
The active topic of study is "${activeTopic}".
Answer the student's questions about "${activeTopic}" in a simple, age-appropriate way suitable for a ${studentGrade} student.
Keep your answers brief, engaging, and highly conversational. Avoid very long explanations.`
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
            console.log("[WARN] Gemini Live API closed by server. Code:", event?.code, "Reason:", event?.reason || "(no reason)");
          }
          if (clientWs.readyState === 1) {
            clientWs.send(JSON.stringify({ closed: true }));
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

    console.log("Connected successfully to Gemini Live API");
    if (clientWs.readyState === 1) {
      clientWs.send(JSON.stringify({ connected: true }));
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
      } catch (_) {}
    }
  });
});

server.listen(port, () => {
  console.log(`> Standalone WebSocket Audio Server ready on ws://localhost:${port}`);
});
