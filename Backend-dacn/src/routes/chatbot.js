import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const faq = [
  {
    keywords: ['phúc lợi', 'benefit', 'bảo hiểm', 'lương tháng 13'],
    answer: 'Công ty cung cấp bảo hiểm y tế và bảo hiểm xã hội theo quy định, lương tháng 13 tùy hiệu suất, cùng 12 ngày phép năm. Bạn có thể liên hệ phòng Nhân sự để biết chính sách áp dụng cho vị trí của mình.'
  },
  {
    keywords: ['trang phục', 'đồng phục', 'ăn mặc'],
    answer: 'Trang phục công sở cần lịch sự, gọn gàng và không có nội dung phản cảm. Thứ Sáu có thể mặc casual nhưng vẫn cần phù hợp môi trường làm việc.'
  },
  {
    keywords: ['giờ làm', 'thời gian làm', 'giờ hành chính'],
    answer: 'Giờ làm việc tiêu chuẩn là 8:30 - 17:30 từ thứ Hai đến thứ Sáu, nghỉ trưa 1 giờ.'
  },
  {
    keywords: ['quy trình nghỉ', 'nộp đơn nghỉ', 'xin nghỉ', 'đăng ký nghỉ'],
    answer: 'Để xin nghỉ: vào trang Nghỉ phép, chọn Tạo đơn mới, chọn loại phép và thời gian, nhập lý do, đính kèm giấy tờ nếu cần rồi gửi đơn để quản lý phê duyệt.'
  }
];

const normalize = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const formatDate = (value) => new Date(value).toLocaleDateString('vi-VN');

const getEmployee = async (connection, userId) => {
  const [rows] = await connection.execute(
    'SELECT id, employee_id, first_name, last_name FROM employees WHERE user_id = ?',
    [userId]
  );
  return rows[0];
};

router.post('/message', verifyToken, async (req, res) => {
  const text = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (!text || text.length > 500) {
    return res.status(400).json({ message: 'Câu hỏi phải có từ 1 đến 500 ký tự.' });
  }

  const query = normalize(text);
  let connection;

  try {
    connection = await pool.getConnection();
    const employee = await getEmployee(connection, req.user.id);

    if (!employee && req.user.role !== 'admin') {
      return res.status(404).json({ message: 'Tài khoản chưa có hồ sơ nhân viên.' });
    }

    if (query.includes('ngay phep') || query.includes('con lai') || query.includes('phep nam')) {
      if (!employee) {
        return res.json({ reply: 'Tài khoản quản trị không có số ngày phép cá nhân.' });
      }

      const [rows] = await connection.execute(
        `SELECT leave_type, status, start_date, end_date
         FROM leaves WHERE employee_id = ?`,
        [employee.id]
      );
      const approvedDays = { annual: 0, sick: 0, personal: 0, unpaid: 0 };
      rows.filter((leave) => leave.status === 'approved').forEach((leave) => {
        const days = Math.floor((new Date(leave.end_date) - new Date(leave.start_date)) / 86400000) + 1;
        approvedDays[leave.leave_type] += Math.max(days, 0);
      });
      const annualRemaining = Math.max(12 - approvedDays.annual, 0);
      return res.json({
        reply: `Bạn còn khoảng ${annualRemaining} ngày phép năm trong hạn mức 12 ngày. Đã sử dụng: ${approvedDays.annual} ngày phép năm, ${approvedDays.sick} ngày phép ốm.`,
        data: { annualRemaining, approvedDays }
      });
    }

    const leaveId = text.match(/(?:lv|đơn)\s*[-#]?\s*(\d+)/i);
    if (leaveId && employee) {
      const [rows] = await connection.execute(
        `SELECT id, leave_type, start_date, end_date, reason, status
         FROM leaves WHERE id = ? AND employee_id = ?`,
        [leaveId[1], employee.id]
      );
      if (!rows[0]) return res.json({ reply: `Không tìm thấy đơn nghỉ phép ${leaveId[1]} của bạn.` });
      const leave = rows[0];
      const status = { pending: 'đang chờ duyệt', approved: 'đã được duyệt', rejected: 'đã bị từ chối' }[leave.status] || leave.status;
      return res.json({
        reply: `Đơn nghỉ phép #${leave.id} của bạn ${status}, từ ${formatDate(leave.start_date)} đến ${formatDate(leave.end_date)}. Lý do: ${leave.reason || 'Không có'}.`
      });
    }

    const matchedFaq = faq.find((item) => item.keywords.some((keyword) => query.includes(normalize(keyword))));
    if (matchedFaq) return res.json({ reply: matchedFaq.answer });

    return res.json({
      reply: 'Mình có thể hỗ trợ: chế độ phúc lợi, quy trình nghỉ phép, số ngày phép còn lại, trạng thái đơn nghỉ phép (ví dụ LV-12), giờ làm việc và quy định về trang phục.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Không thể xử lý câu hỏi lúc này.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
