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
  },
  {
    keywords: ['loại phép', 'các loại nghỉ', 'nghỉ phép gồm'],
    answer: 'Hệ thống hiện hỗ trợ các loại phép: phép năm, phép ốm, phép cá nhân và nghỉ không lương. Mỗi đơn cần có thời gian và lý do cụ thể.'
  },
  {
    keywords: ['chấm công', 'điểm danh', 'check in', 'check out', 'vào ca', 'tan ca'],
    answer: 'Bạn có thể chấm công vào và ra tại trang Chấm công. Hệ thống lưu ngày, giờ vào, giờ ra và trạng thái như có mặt, vắng, đi muộn hoặc nửa ngày.'
  },
  {
    keywords: ['bảng lương', 'tính lương', 'ngày trả lương', 'phiếu lương'],
    answer: 'Thông tin lương cá nhân được hiển thị tại trang Lương, gồm lương cơ bản, phụ cấp, khấu trừ và tổng nhận. Vui lòng liên hệ phòng Nhân sự nếu phát hiện sai lệch.'
  },
  {
    keywords: ['kpi', 'đánh giá hiệu suất', 'chỉ tiêu'],
    answer: 'KPI cá nhân gồm chỉ tiêu, kết quả thực tế, kỳ đánh giá và tỷ lệ hoàn thành. Bạn có thể xem tại trang KPI cá nhân.'
  },
  {
    keywords: ['liên hệ nhân sự', 'phòng nhân sự', 'hỗ trợ nhân sự'],
    answer: 'Các vấn đề về hợp đồng, bảo hiểm, lương, phúc lợi hoặc thông tin cá nhân cần được gửi đến phòng Nhân sự để được xác nhận chính thức.'
  },
  {
    keywords: ['tài khoản', 'đổi mật khẩu', 'bảo mật'],
    answer: 'Bạn không nên chia sẻ mật khẩu hoặc mã đăng nhập. Khi cần cập nhật thông tin tài khoản, hãy sử dụng trang Quản lý tài khoản hoặc liên hệ quản trị viên.'
  }
];

const normalize = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim();

const formatDate = (value) => new Date(value).toLocaleDateString('vi-VN');
const formatMoney = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0
}).format(Number(value || 0));
const leaveTypeNames = {
  annual: 'phép năm',
  sick: 'phép ốm',
  personal: 'phép cá nhân',
  unpaid: 'nghỉ không lương'
};
const attendanceStatusNames = {
  present: 'có mặt',
  absent: 'vắng',
  late: 'đi muộn',
  'half-day': 'nửa ngày'
};

const getEmployee = async (connection, userId) => {
  const [rows] = await connection.execute(
    `SELECT id, employee_id, first_name, last_name, email, phone, department,
            position, hire_date, salary_grade, status
     FROM employees WHERE user_id = ?`,
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

    if (employee && (query.includes('thông tin cá nhân') || query.includes('ho so') ||
      query.includes('thong tin cua toi') || query.includes('thong tin ca nhan') ||
      query.includes('profile') || query.includes('toi la ai'))) {
      const fullName = `${employee.first_name} ${employee.last_name}`.trim();
      return res.json({
        reply: `Hồ sơ của bạn:\n- Họ tên: ${fullName}\n- Mã nhân viên: ${employee.employee_id}\n- Email: ${employee.email || 'Chưa cập nhật'}\n- Số điện thoại: ${employee.phone || 'Chưa cập nhật'}\n- Phòng ban: ${employee.department || 'Chưa cập nhật'}\n- Chức vụ: ${employee.position || 'Chưa cập nhật'}\n- Ngày vào làm: ${employee.hire_date ? formatDate(employee.hire_date) : 'Chưa cập nhật'}\n- Trạng thái: ${employee.status || 'Chưa cập nhật'}`
      });
    }

    if (employee && (query.includes('luong cua toi') || query.includes('luong thang') ||
      query.includes('bang luong') || query.includes('thu nhap'))) {
      const [rows] = await connection.execute(
        `SELECT effective_date, base_salary, allowances, deductions,
                base_salary + allowances - deductions AS total
         FROM salaries WHERE employee_id = ?
         ORDER BY effective_date DESC, id DESC LIMIT 3`,
        [employee.id]
      );
      if (!rows.length) return res.json({ reply: 'Chưa có dữ liệu lương của bạn trên hệ thống.' });
      const salaryText = rows.map((salary) =>
        `${formatDate(salary.effective_date)}: tổng ${formatMoney(salary.total)} (cơ bản ${formatMoney(salary.base_salary)}, phụ cấp ${formatMoney(salary.allowances)}, khấu trừ ${formatMoney(salary.deductions)})`
      ).join('\n');
      return res.json({ reply: `Ba kỳ lương gần nhất của bạn:\n${salaryText}` });
    }

    if (employee && (query.includes('cham cong cua toi') || query.includes('lich su cham cong') ||
      query.includes('di lam') || query.includes('gio vao') || query.includes('gio ra'))) {
      const [rows] = await connection.execute(
        `SELECT check_in_date, check_in_time, check_out_time, status
         FROM attendance WHERE employee_id = ?
         ORDER BY check_in_date DESC, id DESC LIMIT 10`,
        [employee.id]
      );
      if (!rows.length) return res.json({ reply: 'Chưa có dữ liệu chấm công của bạn trên hệ thống.' });
      const attendanceText = rows.map((record) => {
        const checkIn = record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString('vi-VN') : 'Chưa có';
        const checkOut = record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString('vi-VN') : 'Chưa có';
        return `${formatDate(record.check_in_date)}: vào ${checkIn}, ra ${checkOut}, ${attendanceStatusNames[record.status] || record.status || 'chưa xác định'}`;
      }).join('\n');
      return res.json({ reply: `Mười bản ghi chấm công gần nhất:\n${attendanceText}` });
    }

    if (employee && (query.includes('lich su nghi') || query.includes('cac don nghi') ||
      query.includes('don nghi gan day'))) {
      const [rows] = await connection.execute(
        `SELECT id, leave_type, start_date, end_date, reason, status
         FROM leaves WHERE employee_id = ?
         ORDER BY created_at DESC, id DESC LIMIT 10`,
        [employee.id]
      );
      if (!rows.length) return res.json({ reply: 'Bạn chưa có đơn nghỉ phép nào trên hệ thống.' });
      const statusNames = { pending: 'đang chờ duyệt', approved: 'đã duyệt', rejected: 'bị từ chối' };
      const leaveText = rows.map((leave) =>
        `Đơn #${leave.id}: ${leaveTypeNames[leave.leave_type] || leave.leave_type}, ${formatDate(leave.start_date)} - ${formatDate(leave.end_date)}, ${statusNames[leave.status] || leave.status}`
      ).join('\n');
      return res.json({ reply: `Các đơn nghỉ gần đây của bạn:\n${leaveText}` });
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
      reply: 'Mình có thể hỗ trợ: thông tin hồ sơ cá nhân, bảng lương, lịch sử chấm công, lịch sử nghỉ phép, số ngày phép còn lại, trạng thái đơn nghỉ phép (ví dụ LV-12), KPI, chế độ phúc lợi, quy trình nghỉ phép, giờ làm việc và quy định về trang phục.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Không thể xử lý câu hỏi lúc này.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
