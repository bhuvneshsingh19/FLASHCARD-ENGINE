# 🧠 FLASHCARD-ENGINE 
> **AI-Driven Personal Learning Assistant built on Spaced Repetition.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com/)
[![MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb)](https://mongodb.com/)

FLASHCARD-ENGINE is a high-fidelity SaaS application that bridge the gap between reading and retaining. By integrating **Natural Language Processing** to parse PDFs and the **SM-2 Spaced Repetition Algorithm**, it creates an adaptive learning environment that predicts your memory's "forgetting curve."

---

## ✨ Features

### 🤖 Intelligent Flashcard Generation
Stop wasting hours typing notes. Upload any PDF, and our AI logic generates context-aware questions and answers tailored to the material.

### 📈 Dynamic Mastery Score
Your progress is measured mathematically. The app calculates an **Average Mastery Percentage** across your library based on your recall accuracy and the card's Easiness Factor (EF).

### ⚡ Premium Learning Experience
- **3D Card Engine**: Interactive card-flipping UI built with `framer-motion` and custom CSS transforms.
- **Instant Search**: Optimized client-side filtering to navigate large study libraries seamlessly.
- **Smart Dashboard**: Real-time stats showing Total Decks, Due Reviews, and Progress.
- **Confetti Celebration**: Visual rewards upon completing a study session to reinforce positive habits.

### 🔒 Secure Data Management
Enterprise-grade authentication via **Clerk**, providing a secure, private cloud for all your academic materials.

---

## 🔬 The Science: SM-2 Algorithm

This engine implements a customized version of the **SuperMemo-2 (SM-2)** algorithm. It tracks how hard a card was for you and schedules the next appearance to maximize retention.

**Mastery Logic:**
$Mastery = \min(100, \frac{\text{Average Deck E-Factor}}{2.5} \times 100)$

---

## 🚀 Installation & Setup

### Clone the Repository
```bash
git clone [https://github.com/bhuvneshsingh19/FLASHCARD-ENGINE.git](https://github.com/bhuvneshsingh19/FLASHCARD-ENGINE.git)
cd FLASHCARD-ENGINE