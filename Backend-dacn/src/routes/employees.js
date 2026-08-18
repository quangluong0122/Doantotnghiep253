import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get all employees (admin only)
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM employees');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current employee profile (from JWT token)
router.get('/profile/me', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM employees WHERE user_id = ?',
      [req.user.id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get employee by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create employee
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { employee_id, first_name, last_name, email, phone, department, position, hire_date } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO employees (employee_id, first_name, last_name, email, phone, department, position, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [employee_id, first_name, last_name, email, phone, department, position, hire_date]
    );
    connection.release();

    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update employee
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { first_name, last_name, email, phone, department, position } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE employees SET first_name = ?, last_name = ?, email = ?, phone = ?, department = ?, position = ? WHERE id = ?',
      [first_name, last_name, email, phone, department, position, req.params.id]
    );
    connection.release();

    res.json({ success: true, message: 'Employee updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete employee
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM employees WHERE id = ?', [req.params.id]);
    connection.release();

    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
