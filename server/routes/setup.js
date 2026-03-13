import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/setup
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT lmp_date, cycle_length FROM profiles WHERE user_id = $1',
      [req.userId]
    );
    if (result.rows.length === 0) return res.json(null);

    const row = result.rows[0];
    res.json({
      lmpDate: row.lmp_date?.toISOString().slice(0, 10) || null,
      cycleLength: row.cycle_length,
    });
  } catch (err) {
    console.error('Setup GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/setup
router.put(
  '/',
  requireAuth,
  body('lmpDate').matches(DATE_RE).withMessage('Invalid date format'),
  body('cycleLength').isInt({ min: 20, max: 45 }).withMessage('Cycle length must be 20-45'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { lmpDate, cycleLength } = req.body;

    try {
      await pool.query(
        `INSERT INTO profiles (user_id, lmp_date, cycle_length, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET lmp_date = $2, cycle_length = $3, updated_at = NOW()`,
        [req.userId, lmpDate, parseInt(cycleLength, 10)]
      );
      res.json({ lmpDate, cycleLength: parseInt(cycleLength, 10) });
    } catch (err) {
      console.error('Setup PUT error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
