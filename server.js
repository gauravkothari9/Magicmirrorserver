import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import submissionsRouter from './routes/submissions.js';

dotenv.config();

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aura-mirror';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '32kb' }));

// Rate limit form endpoints to slow abuse: 10 req / 15min / IP
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this address. Please try again later.' },
});

app.use('/api', submissionLimiter, submissionsRouter);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ─── MongoDB connection (cached for serverless) ──────────────
// Vercel spins up a new function instance per request, so we cache
// the Mongoose connection on the global object to avoid reconnecting
// on every invocation (cold-start optimisation).
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
  console.log('✓ MongoDB connected');
}

// Ensure DB is connected before every request
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    next(err);
  }
});

// ─── Local dev: start the HTTP server ───────────────────────
// On Vercel, this block is never reached — Vercel handles the
// HTTP layer and calls the exported `app` directly.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`✓ AURA API listening on :${PORT}`)))
    .catch((err) => { console.error(err); process.exit(1); });
}

// ─── Export for Vercel serverless ───────────────────────────
export default app;
