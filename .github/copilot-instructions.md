# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a romantic webpage created by Daniel for Anna while he travels solo in Japan from July 24, 2025, to October 24, 2025. The application serves as a daily love letter and memory-sharing platform with the following key features:

- Dark-themed romantic interface with floating hearts background
- Timeline interface showing Daniel's daily experiences and thoughts of Anna
- Trip counter showing time remaining until Daniel returns home
- Daily entries with romantic messages, song lyrics, and Spotify embeds
- Only current and past days are visible (no future spoilers)
- Optimized for Anna's viewing experience with cute, romantic styling

## Technical Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Database**: Prisma ORM with SQLite for development, PostgreSQL for production
- **Styling**: Tailwind CSS with romantic theme
- **Deployment**: Docker Compose
- **Package Manager**: npm

## Key Business Rules
- Users can only view current and past days (no future days visible)
- Timeline starts July 24, 2025 and ends October 24, 2025
- Each day has: date, romantic message from Daniel, song lyrics, Spotify embed URL
- Trip counter shows time remaining until Daniel returns home to Anna
- Dark mode design with floating hearts animation for romantic atmosphere
- Mobile-first responsive design optimized for Anna's viewing experience
- Content should be heartfelt, romantic, and express Daniel missing Anna

## Code Style
- Use TypeScript for all components and API routes
- Follow React best practices with functional components and hooks
- Use Tailwind CSS for styling with romantic color scheme
- Implement proper error handling and loading states
- Use Prisma for all database operations
- Follow Next.js App Router conventions
