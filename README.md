# 🐉 D&D AI Tavern

A simple browser-based D&D game where you play single-player adventures with an AI Dungeon Master powered by Google Gemini or Zhipu GLM.

All game data (characters, sessions, messages) is stored in the browser via localStorage — no database or authentication required.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes (AI proxy only)
- **AI**: Google Gemini API, Zhipu GLM API
- **Storage**: Browser localStorage

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (free tier available)
- GLM API key (optional, for Zhipu)

### Setup

1. Create `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_key
   GLM_API_KEY=your_glm_key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000`

## Project Structure

```
app/
├── page.tsx                  # Landing page
├── layout.tsx                # Root layout
├── dashboard/page.tsx        # Character & session management
├── characters/create/page.tsx # Character creation
├── game/[sessionId]/page.tsx # Game session
└── api/game/turn/route.ts   # AI turn processing endpoint
components/
├── CharacterSheet.tsx        # Stats display
├── GameBoard.tsx             # Standalone game UI
├── InventoryPanel.tsx        # Inventory management
├── MessageDisplay.tsx        # Chat history
├── PlayerInput.tsx           # Action input
└── SpellsPanel.tsx           # Spell management
context/
└── GameContext.tsx            # Game state provider (localStorage-backed)
lib/
├── ai/                       # AI integrations (Gemini, GLM, prompt builder)
├── game/                     # Game logic (combat, constants)
└── store.ts                  # localStorage CRUD utilities
types/
└── index.ts                  # TypeScript interfaces
```

## How It Works

1. **Create a character** — pick a name and class (Warrior, Mage, Rogue, Cleric)
2. **Start an adventure** — a game session is created with a starting location
3. **Type actions** — describe what your character does
4. **AI responds** — the DM narrates outcomes, rolls dice, tracks HP/XP
5. **Everything saves locally** — refresh the page and continue where you left off

## API

The only server endpoint is `POST /api/game/turn` which proxies your action to the AI. It receives the full game state from the client and returns the DM response.

## License

MIT

**Built as a portfolio project to showcase fullstack development, AI integration, and game design.**
