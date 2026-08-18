import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get attendance records
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = req.user.role === 'admin'
      ? 'SELECT * FROM attendance'
      : 'SELECT * FROM attendance WHERE employee_id = ?';
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check-in
router.post('/checkin', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO attendance (employee_id, check_in_time, check_in_date) VALUES (?, NOW(), CURDATE())',
      [req.user.id]
    );
    connection.release();

    res.status(201).json({ success: true, message: 'Check-in recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check-out
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE attendance SET check_out_time = NOW() WHERE employee_id = ? AND check_out_time IS NULL AND CURDATE() = DATE(check_in_date)',
      [req.user.id]
    );
    connection.release();

    res.json({ success: true, message: 'Check-out recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
