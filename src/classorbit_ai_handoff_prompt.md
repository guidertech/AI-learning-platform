# ClassOrbit — AI Handoff Prompt

Use this prompt to give any AI assistant full context about the ClassOrbit project.

---

## Project Prompt (Copy this entire block)

```
You are helping me build and maintain **ClassOrbit**, an AI-powered personalized learning platform for Grade 1–12 students in India. The platform uses a Socratic teaching approach — the AI never gives direct answers but guides students step-by-step through questions and hints.

---

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Vanilla CSS + Tailwind utility classes
- **Backend**: Supabase (PostgreSQL) for database and authentication
- **AI Text Chat**: Google Gemini API (`gemini-2.5-flash`) via a Next.js API route
- **AI Real-time Voice**: Google Gemini Live API (`gemini-2.5-flash-live-preview`) via a standalone Node.js WebSocket server (`ws-server.mjs`) running on port 3002
- **Auth**: Supabase Auth (Google OAuth / email)

---

## Project File Structure

```
/
├── schema.sql                        # Supabase PostgreSQL tables
├── ws-server.mjs                     # Standalone WebSocket server for Gemini Live Audio (Port 3002)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, wraps app in LearningProvider
│   │   ├── page.tsx                  # Landing / redirect page
│   │   ├── login/page.tsx            # Login with Google OAuth via Supabase
│   │   ├── onboarding/page.tsx       # Profile setup (name, grade, school)
│   │   ├── dashboard/page.tsx        # Student dashboard
│   │   ├── subjects/page.tsx         # Subject grid (Math, Science, Social Science)
│   │   ├── subjects/[subjectId]/chapters/page.tsx   # Subject's chapters list
│   │   ├── chapters/[chapterId]/page.tsx            # Chapter topic roadmap
│   │   ├── learning/[conceptId]/page.tsx            # Learning workspace (interactive study steps + Maya Panel)
│   │   ├── settings/page.tsx         # Settings with inline profile editing
│   │   ├── progress/page.tsx         # Progress & Goals page
│   │   └── api/chat/route.ts         # Socratic text chat API endpoint (POST /api/chat)
│   ├── context/
│   │   └── LearningContext.tsx       # Global React Context (student state, chat messages, profile)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx        # Left sidebar with navigation
│   │   │   ├── Topbar.tsx            # Top bar with page title
│   │   │   └── PageContainer.tsx     # Full-page layout wrapper
│   │   ├── dashboard/
│   │   │   ├── ContinueLearningCard.tsx
│   │   │   └── QuickActions.tsx
│   │   └── learning/
│   │       ├── MayaPanel.tsx         # Floating AI Maya panel (Voice Call + Text Chat modes)
│   │       ├── AskMayaInput.tsx      # Suggestion chips + text input box
│   │       └── AITeacherCard.tsx     # Welcome card from Maya at top of text chat
│   └── lib/
│       ├── supabase.ts               # Supabase client singleton
│       ├── supabase/
│       │   ├── client.ts             # Browser supabase client
│       │   └── middleware.ts         # Auth middleware for route protection
│       └── mock/
│           ├── chapters.ts           # Curriculum: subjects, chapters, topic roadmap nodes
│           ├── topicContent.ts       # Per-topic content: Learn card, Example card, Think quiz, quickReplies
│           └── learning.ts           # Mock weaknesses and initial chat messages
```

---

## Database Schema (Supabase)

```sql
-- 1. profiles: student profile data
CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,             -- local UUID (not tied to auth.uid)
  full_name TEXT,
  current_class TEXT,              -- e.g. "Grade 5"
  school TEXT,
  age INTEGER,
  daily_goal_mins INTEGER DEFAULT 60,
  student_mins INTEGER DEFAULT 0,
  percent_complete INTEGER DEFAULT 0
);

-- 2. tutor_messages: chat history
CREATE TABLE public.tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('USER', 'AI')),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. weaknesses: identified learning gaps
CREATE TABLE public.weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT,
  score INTEGER,
  notes TEXT
);

-- 4. quiz_attempts: quiz score tracking
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id TEXT,
  score INTEGER,
  completed_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Global State (LearningContext.tsx)

The entire app is wrapped in a `LearningProvider`. It exposes:

| Value | Type | Purpose |
|---|---|---|
| `studentName` | string | Active student's full name |
| `studentGrade` | string | e.g. "Grade 5" |
| `studentMins` | number | Total study minutes |
| `dailyGoal` | number | AI-suggested daily goal (read-only, 60 mins) |
| `percentComplete` | number | Overall progress % |
| `activeSubject` | string | Subject currently being studied |
| `activeChapter` | string | Chapter currently open |
| `activeTopic` | string | Topic currently open in workspace |
| `chatMessages` | Message[] | Full text chat history |
| `weaknesses` | Weakness[] | Weak skill areas |
| `addChatMessage` | fn | Adds a message to chat + saves to Supabase |
| `initializeChatForTopic` | fn | Clears old chat, seeds new topic welcome message, resets DB |
| `updateProfile` | fn | Saves name + grade to Supabase or localStorage |
| `incrementStudyTime` | fn | Tracks study time |
| `resetChat` | fn | Clears all chat messages |
| `setActiveSubject/Chapter/Topic` | fn | Update navigation context |

---

## Curriculum Data (Mock)

### chapters.ts
Contains `subjects` array:
- **Mathematics** → Chapters → Topics (roadmap nodes)
- **Science** → Chapters → Topics
- **Social Science** → Chapters → Topics

Each topic has a `slug` (used as the `[conceptId]` URL param).

### topicContent.ts
Each topic slug maps to:
```ts
{
  title: string;
  tutorWelcomeMessage: string;
  learnStep: { title, durationText, imageSrc, descriptionText };
  exampleStep: { title, durationText, imageSrc, descriptionText };
  thinkStep: { promptText, options: string[], correctAnswerText };
  quickReplies: string[];  // 3 suggestion chips for text chat
}
```

---

## Learning Workspace ([conceptId]/page.tsx)

1. Looks up the `conceptId` slug in `topicContent.ts`
2. Sets `activeTopic`, `activeSubject`, `activeChapter` in context
3. Calls `initializeChatForTopic()` to reset chat for the new topic
4. Renders 3 tabbed steps:
   - **LEARN** — descriptive card with image
   - **EXAMPLE** — real-life example card
   - **THINK** — multiple choice quiz
5. Mounts `<MayaPanel />` floating assistant

---

## Maya Panel (MayaPanel.tsx) — 3 Modes

### Mode: `choice`
- Default mode when panel opens
- Two clickable cards: **"Call Maya (Voice)"** and **"Chat Assistant (Text)"**

### Mode: `voice` — Gemini Live Audio Call
- Connects to `ws-server.mjs` on `ws://localhost:3002` with query params: `?name=...&grade=...&topic=...`
- Captures microphone via `getUserMedia`, downsamples from 44.1kHz → 16kHz PCM, sends as Base64 chunks via WebSocket
- Receives streamed audio from Gemini Live, plays via custom `PCMPlayer` (queued AudioBufferSourceNodes)
- Shows animated waveform bars (CSS keyframes)
- Real-time transcription shown in a scrollable exchange card:
  - While thinking: pulsing 3-dot `<TypingIndicator />`
  - While speaking: text typewriter effect (20ms/char via `useEffect`)
- On `turnComplete`/`interrupted` event: saves full sentence to chat history as single bubble
- End call → back to choice mode

### Mode: `text` — Socratic Text Chat
- Chat history with USER/AI bubble layout
- Suggestion chips from `topicContent.ts[topic].quickReplies`
- Messages sent to `/api/chat` with `{ message, history, subject, topic }`
- AI responds using Gemini with Socratic system prompt

---

## Socratic Text Chat API (api/chat/route.ts)

```
POST /api/chat
Body: { message: string, history: [{sender, text}], subject: string, topic: string }
```

- Builds dynamic system prompt:
  > "You are Maya... teaching Grade 5 student. Topic: Comparing Decimals. NEVER give direct answers. Guide with scaffolding questions."
- Calls `gemini-2.5-flash` REST API
- Falls back to local keyword-matching `getLocalSocraticReply()` if API key missing

---

## Standalone Voice WebSocket Server (ws-server.mjs)

- Runs separately: `node ws-server.mjs` on port 3002
- Receives client WebSocket connections
- Parses URL query params: `name`, `grade`, `topic`
- Opens a Gemini Live session using `@google/genai` SDK with:
  - `responseModalities: ["AUDIO"]`
  - `inputAudioTranscription` and `outputAudioTranscription` enabled
  - Dynamic `systemInstruction` with student name, grade, topic
- Relays audio chunks bidirectionally between client and Gemini
- Sends transcription events and `turnComplete` events back to client

---

## Settings Page (/settings)

- Left card: Avatar + student name + grade + Logout button
- Right "Student Profile" card: shows name & grade as a clickable row
  - Clicking opens an **inline edit form** (Name input + Grade dropdown Grade 1–12)
  - Save → calls `updateProfile()` → saves to Supabase / localStorage
  - Shows "Profile updated successfully!" toast on save
- Personalization Settings: AI Tutor Persona (Maya, Socratic) + Daily Goal (read-only, AI-suggested)
- Support & Privacy: Help Center, Privacy Policy links

---

## Auth Flow

1. `/login` → Google OAuth via Supabase
2. After auth → checks if profile exists in `profiles` table
3. If no profile → `/onboarding` (collect name, grade, school)
4. After onboarding → `/dashboard`
5. Auth middleware (`middleware.ts`) protects routes, redirects unauthenticated users to `/login`

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...          # Used by api/chat and ws-server.mjs
```

---

## Running the Project

```bash
# Terminal 1 — Next.js dev server
npm run dev

# Terminal 2 — Gemini Live WebSocket server
node ws-server.mjs
```

---

## Key Design Decisions

1. **Two separate servers**: Next.js dev server cannot handle long-lived bidirectional WebSocket streams for audio, so a standalone Node.js server (`ws-server.mjs`) handles all Gemini Live audio.
2. **No per-topic DB storage**: Chat history is per-student (profile_id), not per-topic. When entering a new topic workspace, `initializeChatForTopic()` clears all old messages and seeds a fresh welcome.
3. **Socratic only**: The AI is strictly instructed never to give direct answers in either voice or text mode — only Socratic scaffolding questions.
4. **Mock curriculum data**: All subjects, chapters, and topic content is stored in TypeScript mock files (`chapters.ts`, `topicContent.ts`). No CMS is used yet.
5. **Dynamic AI context**: Every text chat and voice call receives the current `subject` and `topic` so Maya always talks about what the student is actually studying.
```
