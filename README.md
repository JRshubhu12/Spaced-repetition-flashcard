# 🧠 Spaced Repetition Flashcard Engine

A smart, adaptive flashcard learning platform powered by spaced repetition and real-time progress tracking — built for efficient memorization and long-term retention.

## 🚀 Overview

Traditional studying often leads to information being forgotten quickly. This app combats that using **spaced repetition**, a scientifically proven technique to enhance memory. Users can flip through flashcards, mark what they know or don’t, and the app intelligently schedules future reviews based on their input. Over time, learners spend less time reviewing what they already know and more time reinforcing weak areas.

## 🧩 Features

### ✅ Flashcard System
- Create, edit, and organize flashcards into decks
- Flip animation between front/back of card
- "Know" and "Don't Know" buttons to record performance

### 🧠 Spaced Repetition Logic
- Simplified SM-2 algorithm for review scheduling
- Cards reviewed more often if marked "Don't Know"
- Intelligent review interval increases for mastered cards

### 📊 Progress Dashboard
- Track review stats: correct/incorrect, review count, accuracy
- Visual graphs of learning progress (charts, streaks)
- Daily review count and due card reminders

### 📁 Deck Management
- Group flashcards by subject or topic
- Add tags to filter and sort content
- Import/export deck functionality (CSV)

### 🌐 Optional Features
- User login and cloud sync (via Supabase/Firebase)
- Shareable public decks
- Mobile responsiveness and PWA support

---

## 🛠 Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| Frontend     | React / Next.js          |
| Styling      | Tailwind CSS / Shadcn UI |
| Animations   | Framer Motion            |
| Charts       | Recharts / Chart.js      |
| Backend DB   | Supabase / Firebase      |
| Auth (optional) | Supabase Auth / Firebase Auth |

---

## 🖼 Screenshots

> Add screenshots or GIFs here to showcase:
> - Flashcard flipping UI
> - Dashboard with graphs
> - Deck and card management

---

## 📦 Project Structure

```bash
src/
│
├── components/         # Flashcard, Stats, Deck UI
├── pages/              # Home, Review, Create Deck
├── utils/              # SM-2 logic, helper functions
├── services/           # Database & API functions
└── styles/             # Global and module-based styles

 Developed by Shubham Linkedin- https://www.linkedin.com/in/shubham-choudhary-6474b3234/