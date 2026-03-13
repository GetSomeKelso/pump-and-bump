import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/progress — return all logs for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT date_key, logged FROM daily_logs WHERE user_id = $1 ORDER BY date_key',
      [req.userId]
    );
    const history = {};
    for (const row of result.rows) {
      history[row.date_key.toISOString().slice(0, 10)] = { logged: row.logged };
    }
    res.json(history);
  } catch (err) {
    console.error('Progress GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/progress — add reps for a date
router.post(
  '/',
  requireAuth,
  body('dateKey').matches(DATE_RE).withMessage('Invalid date'),
  body('reps').isInt({ min: 1, max: 10000 }).withMessage('Reps must be between 1 and 10000'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { dateKey, reps } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO daily_logs (user_id, date_key, logged, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, date_key)
         DO UPDATE SET logged = daily_logs.logged + $3, updated_at = NOW()
         RETURNING logged`,
        [req.userId, dateKey, parseInt(reps, 10)]
      );
      res.json({ dateKey, logged: result.rows[0].logged });
    } catch (err) {
      console.error('Progress POST error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PUT /api/progress — set absolute reps for a date (edit)
router.put(
  '/',
  requireAuth,
  body('dateKey').matches(DATE_RE).withMessage('Invalid date'),
  body('logged').isInt({ min: 0, max: 100000 }).withMessage('Logged must be between 0 and 100000'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { dateKey, logged } = req.body;

    try {
      if (logged === 0) {
        await pool.query(
          'DELETE FROM daily_logs WHERE user_id = $1 AND date_key = $2',
          [req.userId, dateKey]
        );
        res.json({ dateKey, logged: 0 });
      } else {
        const result = await pool.query(
          `INSERT INTO daily_logs (user_id, date_key, logged, updated_at)
           VALUES ($1, $2, $3, NOW())
           ON CONFLICT (user_id, date_key)
           DO UPDATE SET logged = $3, updated_at = NOW()
           RETURNING logged`,
          [req.userId, dateKey, parseInt(logged, 10)]
        );
        res.json({ dateKey, logged: result.rows[0].logged });
      }
    } catch (err) {
      console.error('Progress PUT error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PUT /api/progress/sync — bulk sync from localStorage
router.put('/sync', requireAuth, async (req, res) => {
  const { history } = req.body;
  if (!history || typeof history !== 'object') {
    return res.status(400).json({ error: 'Invalid history data' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const [dateKey, entry] of Object.entries(history)) {
      if (!DATE_RE.test(dateKey) || typeof entry?.logged !== 'number' || entry.logged < 0) continue;

      await client.query(
        `INSERT INTO daily_logs (user_id, date_key, logged, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, date_key)
         DO UPDATE SET logged = GREATEST(daily_logs.logged, $3), updated_at = NOW()`,
        [req.userId, dateKey, Math.floor(entry.logged)]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Sync complete' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

export default router;
