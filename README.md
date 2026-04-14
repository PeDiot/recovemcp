# Recove MCP App

A ChatGPT app to search for second-hand clothing and accessories on Vinted through natural conversation. Describe what you want — a single item or a full outfit — and get visual results instantly.

Built with [Skybridge](https://docs.skybridge.tech/home).

## Features

- Natural language search mapped to Vinted's catalog, color, and material filters
- Outfit mode: automatically splits a request into multiple queries (top, bottom, shoes, etc.)
- Scrollable card grid with images, prices, brands, sizes
- Click-through to Vinted listings
- Fashion-aware LLM persona with style trend knowledge

## Setup

### Prerequisites

- Node.js 24+
- A Recove API key (set in `.env`)

### Install & Run

```bash
npm install
cp .env.example .env   # then add your API_KEY
npm run dev
```

This starts:
- MCP server at `http://localhost:3000/mcp`
- Skybridge DevTools at `http://localhost:3000/`

## Project Structure

```
├── server/src/
│   ├── index.ts                # MCP server, widget & resource registration
│   ├── api-client.ts           # Authenticated Vinted API client
│   ├── tool-description.ts     # LLM tool description with catalog/color/material mappings
│   ├── styling-instructions.ts # Fashion persona & workflow rules (exposed as MCP resource)
│   └── env.ts                  # .env loader for local dev
├── web/src/
│   ├── widgets/search-recove.tsx  # Main widget
│   ├── components/                # ItemCard, ItemsScrollableGrid
│   ├── models.ts                  # TypeScript interfaces
│   └── utils.ts                   # Price formatting, browser detection
├── data/                       # Vinted catalog, color & material mappings (JSON)
└── package.json
```

## Deploy

```bash
npx alpic@latest login
npx alpic@latest deploy --yes --env-file .env --project-name recove .
```

Subsequent deploys (env vars are persisted):

```bash
npx alpic@latest deploy --yes --env-file .env .
```

## Resources

- [Skybridge Docs](https://docs.skybridge.tech/)
- [Alpic Docs](https://docs.alpic.ai/)
- [MCP Apps Spec](https://github.com/modelcontextprotocol/ext-apps)
