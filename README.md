# For My Beautiful Anna 💕

A romantic love letter website created by Daniel while traveling solo in Japan from July 24 to October 24, 2025. This application serves as a daily message platform for Anna to feel connected to Daniel's journey and know how much he misses her.

## ✨ Features

- **Trip Counter**: Live countdown showing when Daniel returns home to Anna
- **Timeline Interface**: Beautiful cards showing Daniel's daily thoughts and messages for Anna
- **Date Restrictions**: Only current and past days are visible (no future spoilers!)
- **Daily Love Letters**: Each day includes:
  - Romantic message from Daniel expressing how much he misses Anna
  - Song lyrics that remind Daniel of Anna
  - Embedded Spotify player with their songs
- **Dark Romantic Theme**: Beautiful dark mode with floating hearts animation
- **Anna-Optimized**: Designed specifically for Anna's viewing experience
- **File-Based Content**: All content stored in markdown files in the `/days` directory
- **Docker Support**: Full containerization with docker-compose
- **Dual Authentication**: Separate logins for Anna (viewer) and Daniel (author)

## 🚀 Quick Start

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

### Production Deployment with Docker

1. **Build and start with Docker Compose:**
   ```bash
   npm run docker:up
   ```

2. **Access the application:**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - Database admin: [http://localhost:8080](http://localhost:8080)

3. **Stop the services:**
   ```bash
   npm run docker:down
   ```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM
  - Development: SQLite
  - Production: PostgreSQL
- **Deployment**: Docker & Docker Compose

## 📱 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── author/         # Author-only API routes
│   │   └── trip-days/      # API routes for trip data
│   ├── author/             # Author dashboard pages
│   ├── login/              # Authentication pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (for both roles)
├── components/
│   ├── FloatingHearts.tsx  # Animated background hearts
│   ├── TripCounter.tsx     # Countdown timer
│   └── TripTimeline.tsx    # Timeline display
├── lib/
│   ├── auth.ts             # Authentication configuration
│   ├── days.ts             # File-based content management
│   └── markdown.ts         # Markdown processing utilities
└── types/
    └── next-auth.d.ts      # Auth type definitions

days/
└── content/                # Markdown files for each day's content
```

## 🗄️ Content Structure

The application uses file-based content stored as Markdown files with frontmatter:

```markdown
---
date: "2025-07-24"
title: "First Day in Tokyo"
songTitle: "Can't Help Falling in Love"
songArtist: "Elvis Presley"
songLyrics: "Wise men say, only fools rush in..."
spotifyUrl: "https://open.spotify.com/track/44AyOl4qVkzS48vBsbNXaC"
published: true
---

Hello my beautiful Anna,

Today was amazing in Tokyo, but all I could think about was how much better
it would be with you here...
```

Files are stored in the `/days/content/` directory and named with their slugs (e.g., `first-day-in-tokyo.md`).

## 🎵 Adding New Days

To add new trip days, you can:

1. **Use the author dashboard** (recommended):
   - Log in as Daniel
   - Navigate to the author dashboard
   - Click "New Message" button
   - Fill out the form and save

2. **Manually create Markdown files** in the `/days/content/` directory

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run docker:up` | Start with Docker Compose |
| `npm run docker:down` | Stop Docker services |
| `npm run docker:logs` | View Docker logs |

## 🌐 Environment Variables

Create a `.env.local` file for development:

```bash
# Authentication
AUTH_ANNA_USERNAME=anna
AUTH_ANNA_PASSWORD=iloveyou
AUTH_DANIEL_USERNAME=daniel
AUTH_DANIEL_PASSWORD=secretpassword

# NextAuth
NEXTAUTH_SECRET=VerySecretKeyForDevThatShouldBeChangedInProduction
NEXTAUTH_URL=http://localhost:3000

# Trip Dates
NEXT_PUBLIC_TRIP_START_DATE="2025-07-24"
NEXT_PUBLIC_TRIP_END_DATE="2025-10-24"
```

## 💝 Customization

### Changing Trip Dates
Update the dates in:
- `.env.local` file using the `NEXT_PUBLIC_TRIP_START_DATE` and `NEXT_PUBLIC_TRIP_END_DATE` variables

### Styling Theme
The romantic theme uses Tailwind classes primarily with:
- Rose/Pink color palette
- Gradient backgrounds
- Soft shadows and blur effects

### Adding More Features
Consider adding:
- Photo uploads for each day
- Weather information
- Location tracking
- Export to PDF functionality

## 🐳 Docker Configuration

The application includes:
- **Next.js App**: Main application with file-based content

The Docker setup uses volumes to persist content files between container restarts.

## 📝 License

This is a personal project for Anna & David's romantic journey. ❤️

---

Made with 💕 for an unforgettable journey together.
