import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get all expenses
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
     const query = req.user.role === 'admin'
      ? `SELECT e.*, CONCAT(emp.first_name, ' ', emp.last_name) AS employee_name
        FROM expenses e LEFT JOIN employees emp ON emp.id = e.employee_id
        ORDER BY e.date DESC, e.id DESC`
      : `SELECT e.* FROM expenses e
        INNER JOIN employees emp ON emp.id = e.employee_id
        WHERE emp.user_id = ? ORDER BY e.date DESC, e.id DESC`;
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create expense
router.post('/', verifyToken, async (req, res) => {
  const { employee_id, amount, description, category, date } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO expenses (employee_id, amount, description, category, date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, amount, description, category, date, 'pending']
    );
    connection.release();

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve expense (admin only)
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected', 'paid'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái chi phí không hợp lệ' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE expenses SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    connection.release();

    res.json({ success: true, message: 'Expense updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
