# AURA Mirror — Server

> Express + Mongoose API backend, deployed on Vercel as a serverless Node.js function.

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Local dev port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLIENT_ORIGIN` | Frontend URL for CORS (e.g. `https://aura-mirror.vercel.app`) |

## Deploy to Vercel

1. Push this `server/` folder to its own GitHub repo
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables in **Settings → Environment Variables**:
   - `MONGODB_URI` — your Atlas URI
   - `CLIENT_ORIGIN` — your deployed frontend URL
4. Vercel will use `vercel.json` to route all requests through `server.js`

> ⚠️ Do **not** add `PORT` to Vercel env vars — Vercel manages the port automatically.
