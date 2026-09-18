import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Get all KPIs
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = req.user.role === 'admin'
      ? `SELECT k.*, e.employee_id AS employee_code,
                CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
                e.department
         FROM kpis k LEFT JOIN employees e ON e.id = k.employee_id
         ORDER BY k.period DESC, k.id DESC`
      : `SELECT k.* FROM kpis k
         INNER JOIN employees e ON e.id = k.employee_id
         WHERE e.user_id = ? ORDER BY k.period DESC, k.id DESC`;
    
    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const [rows] = await connection.execute(query, params);
    connection.release();

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// KPI history for one employee, restricted to administrators.
router.get('/employee/:employeeId/details', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT k.id, k.metric, k.target, k.actual, k.period,
              e.employee_id AS employee_code,
              CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
              e.department, e.position
       FROM kpis k INNER JOIN employees e ON e.id = k.employee_id
       WHERE k.employee_id = ?
       ORDER BY k.period ASC, k.id ASC`,
      [req.params.employeeId]
    );
    connection.release();
    if (!rows.length) return res.status(404).json({ message: 'Chưa có dữ liệu KPI của nhân viên' });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create KPI
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { employee_id, metric, target, actual, period } = req.body;

  if (!employee_id || !metric?.trim() || !period?.trim() || Number(target) <= 0 || Number(actual) < 0) {
    return res.status(400).json({ message: 'Thông tin KPI không hợp lệ' });
  }

  try {
    const connection = await pool.getConnection();
    const [employees] = await connection.execute('SELECT id FROM employees WHERE id = ?', [employee_id]);
    if (!employees.length) {
      connection.release();
      return res.status(404).json({ message: 'Nhân viên không tồn tại' });
    }
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
