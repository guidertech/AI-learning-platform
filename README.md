# ClassOrbit: AI-Powered Socratic Learning Platform

ClassOrbit is a premium, interactive educational platform designed for students in Grades 1–12. It features **Maya**, a voice-enabled 3D AI companion that guides students through personalized recovery lessons, tests concept mastery, and offers customized tutoring based on cognitive progress.

This document details the features implemented in the `feature/ai-voice` branch.

---

## 🚀 Key Features Implemented in this Branch

### 1. Interactive 3D Video Avatar Sync & Voice Engine
* **Watermark Free Display:** Center-cropped and auto-scaled (`scale(1.25)`) the classroom avatar player inside [LearningStepCard](src/components/learning/LearningStepCard.tsx) to hide the Grok watermark boundaries.
* **Precise speaking states:** Speaking/idle animation states inside [MayaPanel](src/components/learning/MayaPanel.tsx) are synchronized using browser `AudioContext` buffer duration calculations, resolving sound timing delays.
* **Smooth Video Preloading:** Implemented fast preloading tags to prevent image-to-video blinking transitions when topics load.

### 2. Real-Time Captioning & Transcription Box
* **Multi-Line Captions:** Real-time speech transcription displayed inside a sleek, dedicated speech bubble container below the video player.
* **Auto-Scrolling:** Accumulated words render dynamically and automatically scroll to the bottom.
* **Custom Mini Scrollbar:** Added styled thin scrollbar indicators for easy text scrollability.

### 3. Notes Sidebar & Image Lightbox Modal
* **Split Layout:** Workspace split into a 65% core study workspace and 35% notes sidebar.
* **Click-to-Open Lightbox:** Note images are hidden by default as row buttons. Clicking them triggers a spring-animated full-screen blurred backdrop modal displaying high-resolution mock study notes.

### 4. Dynamic Diagnostic Prerequisite & Chapter-End Tests
* **Diagnostic Checkpoints:** Entry diagnostics checks student pre-requisite knowledge. Passing unlocks the chapter syllabus. Failing recommends tailored recovery steps.
* **Mastery Verifications:** Chapter-end comprehensive exams monitor overall subject score.
* **Result Banners:** Banners displayed on chapter detail pages link directly to test feedback analysis.

### 5. Centralized Test Performance History
* **Activity Log Card:** Implemented a log panel inside the [Subject Progress Report](src/app/progress/[subjectId]/page.tsx) that retrieves completed test results from session storage.
* **Detailed Analytics Actions:** Segments prerequisite and chapter-end results with distinct color-coded badges, scoring indicators, and "Review Details" actions routing back to specific analysis pages.

### 6. Curated Homework Video Link Sharing
* **YouTube Redirections:** AI Homework tab displays a dynamic URL linked to the active topic.
* **Clipboard Copy System:** Includes a copy button on the right edge of the link box with instant "Copied!" green checkmark feedback and `navigator.clipboard` security checks.

### 7. Support FAQ Accordions & Privacy policy Page
* **Inline Accordion Dropdowns:** Toggling **Help Center & FAQ** in settings displays an inline collapsible question box about the dashboard, subjects, and AI workspace.
* **Privacy Policy Page:** Created a dedicated `/privacy` agreement page highlighting COPPA children's safety and Supabase data protection details.

### 8. Full Student Profile Personalization & Dynamic AI Personas
* **All-in-One Profile Editing:** Extended the settings profile manager to edit Name, Grade/Class, School, and Age, synchronized dynamically with database tables.
* **Interactive AI Personas:** Added a dynamic dropdown inside settings to choose tutoring styles:
  * **Socratic Hints (Default):** Guides step-by-step with scaffolded clues.
  * **Direct Explainer:** Direct conceptual answers and solutions.
  * **Friendly Companion:** Budding voice with analogies and stories.
* **API Tone Adaptation:** The selected persona dynamically updates system prompts in the chat endpoint (`/api/chat/route.ts`).

---

## 🛠️ Verification & Compilation
All changes have been successfully compiled and verified with type checking:
```bash
npx tsc --noEmit
```

## 📈 Database Integration
* Target schemas synced to write updates to the main **`profiles`** table instead of `student_profiles` to align registration name setups.
