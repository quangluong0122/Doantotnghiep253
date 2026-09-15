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
      : `SELECT a.* FROM attendance a
         INNER JOIN employees e ON e.id = a.employee_id
         WHERE e.user_id = ? ORDER BY a.check_in_date DESC, a.id DESC`;
    
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
    const [employees] = await connection.execute('SELECT id FROM employees WHERE user_id = ?', [req.user.id]);
    if (!employees.length) {
      connection.release();
      return res.status(404).json({ message: 'Chưa có hồ sơ nhân viên' });
    }
    const [result] = await connection.execute(
      'INSERT INTO attendance (employee_id, check_in_time, check_in_date) VALUES (?, NOW(), CURDATE())',
      [employees[0].id]
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
    const [employees] = await connection.execute('SELECT id FROM employees WHERE user_id = ?', [req.user.id]);
    if (!employees.length) {
      connection.release();
      return res.status(404).json({ message: 'Chưa có hồ sơ nhân viên' });
    }
    await connection.execute(
      'UPDATE attendance SET check_out_time = NOW() WHERE employee_id = ? AND check_out_time IS NULL AND CURDATE() = DATE(check_in_date)',
      [employees[0].id]
    );
    connection.release();

    res.json({ success: true, message: 'Check-out recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
