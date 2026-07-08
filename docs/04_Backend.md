# Backend Architecture

Version: 1.0

---

# Purpose

This document defines the backend architecture of the AI Learning Platform.

The backend is responsible for authentication, content management, AI services, student progress, reports, and APIs.

---

# Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- Next.js API Routes
- Supabase
- PostgreSQL

## Authentication

- Google OAuth
- Supabase Auth

## AI

- OpenAI / Gemini
- LangGraph (Future)

## Storage

- Supabase Storage

## Deployment

- Vercel

---

# Architecture

Student App

↓

Next.js

↓

API Layer

↓

Supabase

↓

AI Service

↓

Database

---

# Authentication Flow

Student

↓

Continue with Google

↓

Supabase Auth

↓

Profile Check

↓

Dashboard

---

# Main Backend Modules

## Authentication

- Login
- Logout
- Session
- User Profile

---

## Content Module

- Subjects
- Chapters
- Topics
- Concepts
- Images
- Videos

---

## Learning Module

- AI Teaching
- Topic Progress
- Chapter Progress
- Continue Learning

---

## Quiz Module

- Topic Quiz
- Chapter Quiz
- Ready Check
- Mastery Check

---

## AI Module

- AI Teaching
- Weakness Detection
- Recovery Generation
- Homework Generation
- Parent Report

---

## Progress Module

- Student Progress
- Learning Streak
- Mastery
- Reports

---

# Security

Every request must verify

- Logged-in User
- School
- Student Role
- Permissions

---

# Future

- Notification Service
- Email Service
- Push Notifications
- Background Jobs
- Analytics
- Payment Module

---

# Development Order

1. Authentication

2. Dashboard

3. Subjects

4. Chapters

5. AI Learning

6. Quiz

7. Weakness Analysis

8. Recovery

9. Mastery Check

10. Progress

11. Teacher Portal

12. Parent Portal

13. Admin CMS

---

# Notes

Business logic should remain inside the backend.

Frontend should only display data.

All AI calls should go through backend APIs.

Never expose AI API keys on the frontend.