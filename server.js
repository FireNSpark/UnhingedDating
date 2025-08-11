import bcrypt from 'bcryptjs';
import User from './models/User.js';

// real signup endpoint for the teaser form
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, password required' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.json({ ok: true, id: user._id, username: user.username });
  } catch (e) {
    // duplicate key friendly message
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern || { field: 'field' })[0];
      return res.status(409).json({ error: `${field} already in use` });
    }
    res.status(500).json({ error: e.message });
  }
});
