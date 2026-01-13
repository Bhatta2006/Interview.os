# INTERVIEW.OS

**INTERVIEW.OS** is a retro-themed, terminal-style interview preparation platform designed to help developers track their LeetCode progress with style. Ditch the boring spreadsheets and SaaS dashboards—embrace the **BLACKOUT_1999** aesthetic.

![INTERVIEW.OS Terminal](https://via.placeholder.com/800x400.png?text=INTERVIEW.OS+DASHBOARD)

## 🚀 Features

*   **Retro Hacking Terminal UI**: A completely custom "game-like" interface using `VT323` and pixel-perfect ASCII art styles.
*   **Company-Wise Tracking**: Track your progress across top tech companies (Google, Amazon, Meta, etc.).
*   **Water Bucket Visualization**: Visual progress bars that fill up as you solve questions.
*   **Advanced Search**: Filter companies by name, or search specifically for topics (e.g., "DP", "Graphs") and question titles.
*   **Authentication**: Secure JWT-based email/password login system.
*   **Guest Mode**: Start tracking immediately without an account (progress saved locally).
*   **Dashboard Analytics**: view streaks, total solved counts, and topic mastery charts.
*   **Revision Mode**: Mark questions for revision and filter them easily.

## 🛠️ Tech Stack

### Frontend (`client`)
*   **Next.js 15+ (App Router)**
*   **Tailwind CSS v4** (Custom Configuration)
*   **Zustand** (State Management)
*   **Recharts** (Data Visualization)
*   **Axios** (API Communication)
*   **Framer Motion** (Animations)

### Backend (`server`)
*   **Node.js & Express**
*   **TypeScript**
*   **Prisma ORM**
*   **PostgreSQL** (Database)
*   **JSON Web Tokens (JWT)** (Auth)
*   **Bcrypt** (Security)

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL Database URL

### 1. Clone the Repository
```bash
git clone https://github.com/Bhatta2006/Interview.os.git
cd Interview.os
```

### 2. Install Dependencies
Run this command in the root folder to install dependencies for both client and server:
```bash
npm run install:all
```
*(Or install manually in `client` and `server` folders)*

### 3. Environment Setup

**Server (`server/.env`)**
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-super-secret-key"
```

**Client (`client/.env.local`)**
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### 4. Database Migration
Navigate to the server folder and push the schema to your DB:
```bash
cd server
npx prisma db push
cd ..
```

### 5. Run the Application
You can start both the frontend and backend with a single command from the root:
```bash
npm run dev
```

*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend**: [http://localhost:5000](http://localhost:5000)

## 🎮 Usage Guide

1.  **Select Target**: Choose a company from the list or use the terminal input to search.
2.  **Jack In**: Click on a company to view the "Sector Data" (Questions).
3.  **Execute**: Solve the question on LeetCode (link provided).
4.  **Mark Status**: Click the `[ ]` checkbox to mark it as `[X]` (Done).
5.  **Analyze**: Go to `STATS_` to view your streak and mastery.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
