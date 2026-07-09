import { createServer } from "http";
import { parse } from "url";
import next from "next";
import express from "express";
import { WebSocketServer } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

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

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  // Handle API health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Handle all other Next.js routes
  app.use((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Handle WebSocket upgrades for live chat
  server.on("upgrade", (request, socket, head) => {
    const { pathname } = parse(request.url || "", true);
    if (pathname === "/api/live-chat") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  // Handle Live Chat connection
  wss.on("connection", async (clientWs) => {
    console.log("New real-time client connected via WebSocket");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      clientWs.send(JSON.stringify({ error: "GEMINI_API_KEY is not configured." }));
      clientWs.close();
      return;
    }

    let geminiSession = null;

    try {
      const ai = getAI();
      console.log("Connecting to Gemini Live API...");

      geminiSession = await ai.live.connect({
        model: "gemini-2.0-flash-exp",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede" // Options: Puck, Charon, Kore, Fenrir, Zephyr, Aoede
              }
            }
          },
          systemInstruction: "You are a professional, friendly, and helpful real-time AI companion. Keep your answers brief, engaging, natural, and conversational.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message) => {
            try {
              const payload = {};

              // Audio data from Gemini
              const audio = message.data;
              if (audio) {
                payload.audio = audio;
              }

              // Transcriptions
              const interimInput = message.serverContent?.interimInputTranscription?.text;
              const inputTranscription = message.serverContent?.inputTranscription?.text;
              const outputTranscription = message.serverContent?.outputTranscription?.text;

              if (interimInput) payload.interimInputTranscription = interimInput;
              if (inputTranscription) payload.inputTranscription = inputTranscription;
              if (outputTranscription) payload.outputTranscription = outputTranscription;

              // Turn/interruption signals
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
          onclose: () => {
            console.log("Gemini Live API connection closed by server");
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
          // Stream client microphone audio to Gemini (16kHz PCM little-endian)
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

    clientWs.on("close", () => {
      console.log("Client WebSocket connection closed. Closing Gemini session.");
      if (geminiSession) {
        try {
          geminiSession.close();
        } catch (_) {}
      }
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error("Error preparing Next.js app:", err);
  process.exit(1);
});
