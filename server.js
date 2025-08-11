// server.js (ESM)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Mongo ----
const MONGO_URI = (process.env.MONGO_URI || '').trim();
if (!/^mongodb(\+srv)?:\/\//i.test(MONGO_URI)) {
  console.error('Missing/invalid MONGO_URI. Set it in your env.');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.error('Mongo error:', err.message));
}

// ---- Models ----
import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const userSchema = new Schema(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 24, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);

const User = model('User', userSchema);

// ---- API ----
app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, password required' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    return res.json({ ok: true, id: user._id, username: user.username });
  } catch (e) {
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern || { field: 1 })[0] || 'field';
      return res.status(409).json({ error: `${field} already in use` });
    }
    return res.status(500).json({ error: e.message });
  }
});

// ---- Static teaser site ----
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---- Start ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Unhinged running on :${PORT}`));

// Optional: show unhandled errors in logs
process.on('unhandledRejection', e => console.error('unhandledRejection:', e));
process.on('uncaughtException', e => console.error('uncaughtException:', e));
