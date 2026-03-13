import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, query, validationResult } from 'express-validator';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { sendVerificationEmail } from '../config/email.js';

const router = Router();
const BCRYPT_ROUNDS = 12;
const JWT_EXPIRY = '7d';
const VERIFY_TOKEN_EXPIRY_HOURS = 24;

function cookieOpts() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

function issueToken(res, user) {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
  res.cookie('token', token, cookieOpts());
}

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const smtpConfigured = !!process.env.SMTP_HOST;

      if (smtpConfigured) {
        const verifyToken = crypto.randomBytes(32).toString('hex');
        const verifyExpires = new Date(Date.now() + VERIFY_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

        await pool.query(
          `INSERT INTO users (email, password_hash, verify_token, verify_expires)
           VALUES ($1, $2, $3, $4)`,
          [email, passwordHash, verifyToken, verifyExpires]
        );

        const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        await sendVerificationEmail(email, verifyToken, appUrl);

        res.status(201).json({ message: 'Account created. Check your email to verify.' });
      } else {
        // No SMTP configured — auto-verify
        await pool.query(
          `INSERT INTO users (email, password_hash, verified)
           VALUES ($1, $2, TRUE)`,
          [email, passwordHash]
        );

        res.status(201).json({ message: 'Account created! You can now log in.' });
      }
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.verified) {
        return res.status(403).json({ error: 'Please verify your email before logging in' });
      }

      issueToken(res, user);

      // Fetch profile
      const profile = await pool.query('SELECT lmp_date, cycle_length FROM profiles WHERE user_id = $1', [user.id]);
      const setup = profile.rows[0]
        ? { lmpDate: profile.rows[0].lmp_date?.toISOString().slice(0, 10), cycleLength: profile.rows[0].cycle_length }
        : null;

      res.json({ user: { id: user.id, email: user.email }, setup });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out' });
});

// GET /api/auth/verify-email?token=xxx
router.get(
  '/verify-email',
  query('token').isHexadecimal().isLength({ min: 64, max: 64 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect('/?verify=invalid');
    }

    try {
      const { token } = req.query;
      const result = await pool.query(
        `UPDATE users SET verified = TRUE, verify_token = NULL, verify_expires = NULL
         WHERE verify_token = $1 AND verify_expires > NOW() AND verified = FALSE
         RETURNING id`,
        [token]
      );

      if (result.rows.length === 0) {
        return res.redirect('/?verify=expired');
      }

      res.redirect('/?verify=success');
    } catch (err) {
      console.error('Verify error:', err);
      res.redirect('/?verify=error');
    }
  }
);

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, email FROM users WHERE id = $1', [req.userId]);
    const user = userResult.rows[0];
    if (!user) return res.status(401).json({ error: 'User not found' });

    const profile = await pool.query('SELECT lmp_date, cycle_length FROM profiles WHERE user_id = $1', [req.userId]);
    const setup = profile.rows[0]
      ? { lmpDate: profile.rows[0].lmp_date?.toISOString().slice(0, 10), cycleLength: profile.rows[0].cycle_length }
      : null;

    res.json({ user: { id: user.id, email: user.email }, setup });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
