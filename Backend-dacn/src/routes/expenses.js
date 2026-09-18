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

// Get expense totals for a month
router.get('/summary', verifyToken, async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({ message: 'Tháng phải có định dạng YYYY-MM' });
  }

  try {
    const connection = await pool.getConnection();
    const employeeFilter = req.user.role === 'admin' ? '' : 'AND emp.user_id = ?';
    const params = req.user.role === 'admin' ? [month] : [month, req.user.id];
    const [rows] = await connection.execute(
      `SELECT
        COALESCE(SUM(e.amount), 0) AS total_amount,
        COALESCE(SUM(CASE WHEN e.status IN ('approved', 'paid') THEN e.amount ELSE 0 END), 0) AS approved_amount
       FROM expenses e INNER JOIN employees emp ON emp.id = e.employee_id
       WHERE DATE_FORMAT(e.date, '%Y-%m') = ? ${employeeFilter}`,
      params
    );
    connection.release();
    res.json({ month, total_amount: Number(rows[0].total_amount), approved_amount: Number(rows[0].approved_amount) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create expense
router.post('/', verifyToken, async (req, res) => {
  const { amount, description, category, date } = req.body;

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
      'INSERT INTO expenses (employee_id, amount, description, category, date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [employees[0].id, amount, description, category, date, 'pending']
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
