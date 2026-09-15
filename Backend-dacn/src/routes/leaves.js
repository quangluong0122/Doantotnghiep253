import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get all leaves
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = req.user.role === 'admin'
      ? 'SELECT * FROM leaves ORDER BY created_at DESC, id DESC'
      : `SELECT l.* FROM leaves l
         INNER JOIN employees e ON e.id = l.employee_id
         WHERE e.user_id = ? ORDER BY l.created_at DESC, l.id DESC`;
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create leave request
router.post('/', verifyToken, async (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;

  try {
    const connection = await pool.getConnection();
    const [employees] = await connection.execute(
      'SELECT id FROM employees WHERE user_id = ?',
      [req.user.id]
    );
    if (!employees.length) {
      connection.release();
      return res.status(404).json({ message: 'Chưa có hồ sơ nhân viên' });
    }
    const [result] = await connection.execute(
      'INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [employees[0].id, leave_type, start_date, end_date, reason, 'pending']
    );
    connection.release();

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject leave (admin only)
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { status } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE leaves SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    connection.release();

    res.json({ success: true, message: 'Leave updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
