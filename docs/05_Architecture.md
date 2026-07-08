Step 1 — Tech Stack
Frontend

Next.js 15
React 19
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
React Hook Form
Zod

Backend

Supabase
PostgreSQL
Prisma ORM ❌
Drizzle ORM ✅

Step 2 — Final Folder Structure

ai-learning-platform/

│
├── app/
│
│   ├── (auth)/
│   │
│   ├── (student)/
│   │      dashboard/
│   │      subjects/
│   │      chapters/
│   │      learning/
│   │      recovery/
│   │      mastery/
│   │      progress/
│   │
│   ├── (teacher)/
│   │
│   ├── (parent)/
│   │
│   ├── (admin)/
│   │
│   ├── api/
│   │
│   └── layout.tsx
│
├── components/
│
│   ├── ui/
│   ├── dashboard/
│   ├── learning/
│   ├── quiz/
│   ├── recovery/
│   ├── mastery/
│   ├── reports/
│   └── shared/
│
├── lib/
│
│   ├── auth/
│   ├── db/
│   ├── ai/
│   ├── utils/
│   └── validators/
│
├── services/
│
│   ├── ai/
│   ├── progress/
│   ├── quiz/
│   ├── homework/
│   └── reports/
│
├── hooks/
│
├── types/
│
├── constants/
│
├── public/
│
├── docs/
│
└── package.json

Step 3 — Architecture Diagram
                        STUDENT

                           │

                           ▼

                 Next.js Frontend

                           │

                           ▼

                    API ROUTES

          ┌──────────┼──────────┐

          ▼          ▼          ▼

    Supabase     AI Service    Storage

          │

          ▼

     PostgreSQL Database

          │

          ▼

 Learning Data + Progress


 Step 4 — Development Order
 Sprint 1

Authentication

↓

Profile Setup

↓

Dashboard

↓

Subjects

↓

Chapters

↓

Learning

↓

Quiz

↓

Recovery

↓

Mastery

↓

Progress

Step 5 — First Sprint
Sprint 1

✅ Project Setup

✅ Authentication

✅ Profile Setup

✅ Dashboard


