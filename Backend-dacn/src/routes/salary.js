import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get salaries for admins or the current employee
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `
      SELECT
        s.id,
        s.employee_id AS employeeId,
        DATE_FORMAT(s.effective_date, '%m/%Y') AS month,
        s.base_salary AS baseSalary,
        s.allowances AS bonus,
        s.deductions AS deduction,
        (s.base_salary + s.allowances - s.deductions) AS total,
        'paid' AS status,
        CONCAT(e.first_name, ' ', e.last_name) AS employeeName
      FROM salaries s
      LEFT JOIN employees e ON e.id = s.employee_id
      ${req.user.role === 'admin' ? '' : 'WHERE e.user_id = ?'}
      ORDER BY s.effective_date DESC, s.id DESC
    `;
    const [rows] = await connection.execute(
      query,
      req.user.role === 'admin' ? [] : [req.user.id]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update salary
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { base_salary, allowances, deductions } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE salaries SET base_salary = ?, allowances = ?, deductions = ? WHERE id = ?',
      [base_salary, allowances, deductions, req.params.id]
    );
    connection.release();

    res.json({ success: true, message: 'Salary updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
