<div align="center">

# 📰 CurrentPulse AI

### AI-Powered Daily Current Affairs for UPSC & Government Exam Aspirants

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen?style=for-the-badge)](https://currentpulse-ai.replit.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

---

*A focused, information-rich study companion that aggregates daily current affairs from major Indian news sources, processes them into structured UPSC-style summaries, and presents them in an elegant dark-mode interface built for serious exam preparation.*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 **Structured Summaries** | Every article includes Key Points, Background, Analysis, and Exam Relevance (Prelims/Mains/Both) |
| 🗂️ **GS Paper Mapping** | Articles auto-tagged to GS1/GS2/GS3/GS4 — Polity, Economy, Environment, IR, Science & Tech |
| 🎯 **Daily Dashboard** | Live stats on today's articles, trending topics, and category breakdown |
| 🔍 **Smart Search & Filter** | Search by topic, filter by category, date, or exam relevance |
| 📖 **Read / 🎧 Listen / 📺 Watch** | Three consumption modes per article (Read structured notes, Listen via audio, Watch video) |
| 🔖 **Bookmarks** | Save important articles for later revision |
| 📝 **Personal Notes** | Write and manage study notes linked to articles |
| 🧠 **AI Quiz** | MCQ quiz generated from article content with explanations and difficulty levels |
| 📆 **Weekly Compilations** | Browse past weeks' articles grouped by GS category for revision |
| 🌙 **Dark Mode** | Default dark theme optimized for long study sessions |

---

## 🖥️ Screenshots

<div align="center">

### Dashboard
*Today's current affairs at a glance — stats, trending topics, and recent articles*

![Dashboard](./attached_assets/dashboard-preview.png)

### Daily Feed
*All articles with search, category filters, and GS paper tags*

</div>

---

## 🏗️ Architecture

```
currentpulse-ai/
├── artifacts/
│   ├── api-server/          # Express 5 REST API (TypeScript)
│   │   └── src/
│   │       ├── routes/      # articles, bookmarks, notes, quiz, categories, dashboard
│   │       └── lib/         # logger, seed
│   └── currentpulse/        # React + Vite frontend (TypeScript)
│       └── src/
│           ├── pages/       # Dashboard, Articles, ArticleDetail, Quiz, Bookmarks, Notes, Weekly
│           ├── components/  # UI components (shadcn/ui)
│           └── lib/         # constants, utils
├── lib/
│   ├── api-spec/            # OpenAPI 3.1 spec (single source of truth)
│   ├── api-client-react/    # Generated React Query hooks (auto-generated)
│   ├── api-zod/             # Generated Zod validation schemas (auto-generated)
│   └── db/                  # Drizzle ORM schema + PostgreSQL client
└── scripts/                 # Utility scripts
```

---

## 🗄️ Database Schema

```
articles          → Core content: title, source, category, gsMapping,
                    keyPoints[], background, analysis, examRelevance, tags[]
bookmarks         → User saved articles (articleId → articles)
notes             → Personal study notes (optional articleId link)
quiz_questions    → MCQ questions (articleId, question, options[4],
                    correctAnswer, explanation, difficulty)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v9+
- PostgreSQL database (or use Replit's built-in DB)

### Installation

```bash
# Clone the repository
git clone https://github.com/TanmayGoyal022/currentpulse-ai.git
cd currentpulse-ai

# Install all workspace dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the root or set these in your environment:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=your-secret-key-here
PORT=8080         # For API server
BASE_PATH=/       # For frontend Vite
```

### Development

```bash
# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the frontend (in a separate terminal)
pnpm --filter @workspace/currentpulse run dev

# Push database schema
pnpm --filter @workspace/db run push

# Regenerate API types after spec changes
pnpm --filter @workspace/api-spec run codegen

# Full typecheck
pnpm run typecheck
```

The API server auto-seeds the database with 10 sample articles and 8 quiz questions on first startup if the database is empty.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/healthz` | Server health check |
| `GET` | `/api/articles` | List articles (filter by category, date, search, examRelevance) |
| `GET` | `/api/articles/today` | Today's articles grouped by category |
| `GET` | `/api/articles/weekly` | Weekly compilation (with weekOffset param) |
| `GET` | `/api/articles/:id` | Single article detail |
| `GET` | `/api/categories` | All GS categories with article counts |
| `GET` | `/api/bookmarks` | User bookmarks |
| `POST` | `/api/bookmarks` | Bookmark an article |
| `DELETE` | `/api/bookmarks/:id` | Remove bookmark |
| `GET` | `/api/notes` | User notes |
| `POST` | `/api/notes` | Create note |
| `PATCH` | `/api/notes/:id` | Update note |
| `DELETE` | `/api/notes/:id` | Delete note |
| `GET` | `/api/quiz` | Quiz questions (filter by articleId, category) |
| `GET` | `/api/dashboard/summary` | Dashboard stats (today/week counts, category breakdown) |
| `GET` | `/api/dashboard/trending` | Trending topics from recent articles |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Component library |
| Framer Motion | Animations & transitions |
| TanStack React Query | Server state management |
| Wouter | Lightweight routing |
| next-themes | Dark/light mode |
| date-fns | Date formatting |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Express 5 + TypeScript | REST API framework |
| Drizzle ORM | Type-safe database queries |
| PostgreSQL | Primary database |
| Zod | Schema validation |
| Pino | Structured JSON logging |
| esbuild | Fast TypeScript bundling |

### Tooling
| Technology | Purpose |
|---|---|
| pnpm Workspaces | Monorepo management |
| Orval | OpenAPI → React Query + Zod codegen |
| TypeScript 5.9 | End-to-end type safety |
| OpenAPI 3.1 | API contract specification |

---

## 📚 GS Paper Categories

| Category | GS Paper | Topics |
|---|---|---|
| 🔵 Polity & Governance | GS2 | Constitution, Parliament, Judiciary, Federalism |
| 🟢 Economy | GS3 | Budget, Trade, Agriculture, Infrastructure, Banking |
| 🟦 Environment & Ecology | GS3 | Biodiversity, Climate Change, Conservation |
| 🟣 International Relations | GS2 | Foreign Policy, India's Neighbours, Global Orgs |
| 🟠 Science & Technology | GS3 | Space, Defence, AI, Biotech, IT |

---

## 🔮 Roadmap

- [ ] **Real news fetching** — RSS feed integration with The Hindu, Economic Times, Indian Express
- [ ] **AI summarization** — GPT-4/Claude pipeline for auto-generating UPSC-style summaries
- [ ] **Text-to-speech** — Convert articles to MP3 audio for the Listen mode
- [ ] **PDF generation** — Export daily notes as structured PDF
- [ ] **User authentication** — Personal accounts for persistent bookmarks & notes
- [ ] **Push notifications** — Daily digest notification
- [ ] **Monthly compilations** — Auto-generated monthly revision sets
- [ ] **Mobile app** — React Native / Expo mobile version

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built for UPSC aspirants, by someone who understands the grind.

**[View Live Demo](https://currentpulse-ai.replit.app)** · **[Report Bug](https://github.com/TanmayGoyal022/currentpulse-ai/issues)** · **[Request Feature](https://github.com/TanmayGoyal022/currentpulse-ai/issues)**

</div>
