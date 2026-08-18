import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get all salaries (admin only)
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM salaries');
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
