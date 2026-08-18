import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get all KPIs
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = req.user.role === 'admin'
      ? 'SELECT * FROM kpis'
      : 'SELECT * FROM kpis WHERE employee_id = ?';
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create KPI
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { employee_id, metric, target, actual, period } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO kpis (employee_id, metric, target, actual, period) VALUES (?, ?, ?, ?, ?)',
      [employee_id, metric, target, actual, period]
    );
    connection.release();

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update KPI
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { target, actual } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE kpis SET target = ?, actual = ? WHERE id = ?',
      [target, actual, req.params.id]
    );
    connection.release();

    res.json({ success: true, message: 'KPI updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
