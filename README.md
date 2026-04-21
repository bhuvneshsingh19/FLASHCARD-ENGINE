# FlashcardEngine 🧠 vs. Cramming

FlashcardEngine is an AI-powered SaaS platform designed to transform static study materials (PDFs) into dynamic, interactive flashcards. Utilizing the scientifically proven **SM-2 Spaced Repetition Algorithm**, the app optimizes long-term memory retention by scheduling reviews exactly when you are likely to forget.

## 🚀 Key Features

- **AI-Powered Generation**: Instantly convert complex PDFs (Engineering, Medical, Law) into structured flashcards using NLP.
- **SM-2 Algorithm**: Adaptive learning logic that calculates Easiness Factors (EF) and Next Review dates based on user performance.
- **Real-time Analytics**: A professional dashboard tracking Total Decks, Due Reviews, and Average Mastery percentage.
- **Premium UI/UX**: Built with Tailwind CSS and Framer Motion for a smooth, high-fidelity 3D flipping experience.
- **Secure Authentication**: Managed by Clerk for seamless login/signup flows.
- **Search & Filter**: Instant client-side filtering for large study libraries.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: Next.js API Routes, [Prisma ORM](https://www.prisma.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) (NoSQL)
- **Auth**: [Clerk](https://clerk.com/)
- **State/Alerts**: [Sonner](https://sonner.emilkowal.ski/) (Toasts), [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Clerk account

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/flashcard-engine.git](https://github.com/your-username/flashcard-engine.git)
   cd flashcard-engine