import express from 'express';
import pool from '../config/database.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const filter = req.user.role === 'admin' ? '' : 'WHERE e.user_id = ?';
    const [rows] = await connection.execute(
      `SELECT t.id, t.employee_id, t.title, t.status, t.priority, t.due_date, t.completed_at,
              e.employee_id AS employee_code,
              CONCAT(e.first_name, ' ', e.last_name) AS employee_name
       FROM tasks t INNER JOIN employees e ON e.id = t.employee_id
       ${filter}
       ORDER BY t.due_date IS NULL, t.due_date ASC, t.id DESC`,
      req.user.role === 'admin' ? [] : [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Không thể tải lịch sử nhiệm vụ.' });
  } finally {
    if (connection) connection.release();
  }
});

router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { employee_id, title, status = 'todo', priority = 'medium', due_date, completed_at } = req.body;
  if (!employee_id || !title?.trim() ||
      !['todo', 'in-progress', 'completed', 'blocked'].includes(status) ||
      !['low', 'medium', 'high', 'urgent'].includes(priority)) {
    return res.status(400).json({ message: 'Thông tin nhiệm vụ không hợp lệ.' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO tasks (employee_id, title, status, priority, due_date, completed_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_id, title.trim(), status, priority, due_date || null, completed_at || null]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Không thể tạo nhiệm vụ.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
