import express from 'express';
import pool from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { searchHrDocuments } from '../knowledgeBase/hrDocuments.js';
import { askAi } from '../services/aiService.js';

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

const classifyIntent = (query) => {
  const intents = [
    { name: 'profile', terms: ['thong tin ca nhan', 'thong tin cua toi', 'ho so', 'ho ten', 'profile', 'toi la ai'] },
    { name: 'salary', terms: ['luong cua toi', 'luong thang', 'bang luong', 'thu nhap'] },
    { name: 'attendance', terms: ['cham cong cua toi', 'lich su cham cong', 'di lam', 'gio vao', 'gio ra'] },
    { name: 'leave-history', terms: ['lich su nghi', 'cac don nghi', 'don nghi gan day'] },
    { name: 'leave-balance', terms: ['ngay phep', 'con lai', 'phep nam'] },
    { name: 'performance', terms: ['hieu suat cua toi', 'ket qua hieu suat', 'thong ke hieu suat', 'kpi cua toi'] },
    { name: 'tasks', terms: ['nhiem vu cua toi', 'cong viec cua toi', 'task cua toi', 'lich su nhiem vu'] },
    { name: 'kpi-policy', terms: ['quy dinh kpi', 'chinh sach kpi', 'danh gia hieu suat', 'chi tieu'] },
    { name: 'policy', terms: ['phuc loi', 'che do phuc loi', 'bao hiem', 'quy trinh', 'quy trinh nghi phep', 'dong phuc', 'trang phuc', 'loai phep', 'gio lam'] },
  ];
  const matches = intents.filter((intent) => intent.terms.some((term) => query.includes(term)));
  return matches.length === 1 ? matches[0].name : matches.length > 1 ? 'ambiguous' : 'unknown';
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

router.post('/message', verifyToken, rateLimit({
  windowMs: 60_000,
  max: 20,
  key: (req) => `user:${req.user.id}`,
}), async (req, res) => {
  const text = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (!text || text.length > 500) {
    return res.status(400).json({ message: 'Câu hỏi phải có từ 1 đến 500 ký tự.' });
  }

  const query = normalize(text);
  const intent = classifyIntent(query);
  if (intent === 'ambiguous') {
    return res.json({ reply: 'Bạn muốn hỏi về lương, chấm công, nghỉ phép hay KPI? Vui lòng chọn một nội dung cụ thể.', intent });
  }
  if (intent === 'unknown' && text.split(/\s+/).length < 3) {
    return res.json({ reply: 'Bạn có thể nói rõ hơn, ví dụ: “KPI của tôi tháng này” hoặc “Lịch sử chấm công của tôi”.', intent });
  }
  let connection;

  try {
    connection = await pool.getConnection();
    const employee = await getEmployee(connection, req.user.id);

    if (!employee && req.user.role !== 'admin') {
      return res.status(404).json({ message: 'Tài khoản chưa có hồ sơ nhân viên.' });
    }

    if (employee && (intent === 'profile' || query.includes('thông tin cá nhân') || query.includes('ho so') ||
      query.includes('thong tin cua toi') || query.includes('thong tin ca nhan') ||
      query.includes('profile') || query.includes('toi la ai'))) {
      const fullName = `${employee.first_name} ${employee.last_name}`.trim();
      return res.json({
        reply: `Hồ sơ của bạn:\n- Họ tên: ${fullName}\n- Mã nhân viên: ${employee.employee_id}\n- Email: ${employee.email || 'Chưa cập nhật'}\n- Số điện thoại: ${employee.phone || 'Chưa cập nhật'}\n- Phòng ban: ${employee.department || 'Chưa cập nhật'}\n- Chức vụ: ${employee.position || 'Chưa cập nhật'}\n- Ngày vào làm: ${employee.hire_date ? formatDate(employee.hire_date) : 'Chưa cập nhật'}\n- Trạng thái: ${employee.status || 'Chưa cập nhật'}`
      });
    }

    if (employee && (intent === 'salary' || query.includes('luong cua toi') || query.includes('luong thang') ||
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

    if (employee && (intent === 'attendance' || query.includes('cham cong cua toi') || query.includes('lich su cham cong') ||
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

    if (employee && (intent === 'leave-history' || query.includes('lich su nghi') || query.includes('cac don nghi') ||
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

    if (employee && intent === 'tasks') {
      const [rows] = await connection.execute(
        `SELECT title, status, priority, due_date, completed_at
         FROM tasks WHERE employee_id = ?
         ORDER BY due_date IS NULL, due_date ASC, id DESC LIMIT 10`,
        [employee.id]
      );
      if (!rows.length) return res.json({ reply: 'Bạn chưa có nhiệm vụ nào trên hệ thống.', intent });
      const statusNames = { todo: 'chưa làm', 'in-progress': 'đang làm', completed: 'đã hoàn thành', blocked: 'bị chặn' };
      const taskText = rows.map((task) =>
        `- ${task.title}: ${statusNames[task.status] || task.status}, ưu tiên ${task.priority}, hạn ${task.due_date ? formatDate(task.due_date) : 'chưa đặt'}`
      ).join('\n');
      return res.json({ reply: `Lịch sử nhiệm vụ của bạn:\n${taskText}`, intent });
    }

    if (employee && intent === 'performance') {
      const [rows] = await connection.execute(
        `SELECT k.period AS month, SUM(k.target) AS target, SUM(k.actual) AS actual
         FROM kpis k
         WHERE k.employee_id = ?
         GROUP BY k.period
         ORDER BY month DESC LIMIT 6`,
        [employee.id]
      );
      if (!rows.length) return res.json({ reply: 'Chưa có dữ liệu thống kê hiệu suất của bạn.', intent });
      const [taskRows] = await connection.execute(
        `SELECT COUNT(*) AS total_tasks,
                SUM(status = 'completed') AS completed_tasks
         FROM tasks WHERE employee_id = ?`,
        [employee.id]
      );
      const taskSummary = taskRows[0] || { total_tasks: 0, completed_tasks: 0 };
      const statistics = rows.map((row) => {
        const score = Number(row.target) > 0 ? Math.round((Number(row.actual) / Number(row.target)) * 10000) / 100 : 0;
        return `- ${row.month}: KPI ${score}%`;
      }).join('\n');
      return res.json({
        reply: `Đây là thống kê hiệu suất đã ghi nhận, không phải dự đoán:\n${statistics}\n- Nhiệm vụ: hoàn thành ${taskSummary.completed_tasks || 0}/${taskSummary.total_tasks || 0}`,
        intent,
        predictive: false
      });
    }

    if (intent === 'leave-balance' || query.includes('ngay phep') || query.includes('con lai') || query.includes('phep nam')) {
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

    const documents = searchHrDocuments(query);
    if (documents.length) {
      return res.json({
        reply: `${documents.map((document) => `${document.title}: ${document.content}`).join('\n\n')}\n\nNguồn: tài liệu nội bộ.`,
        intent: intent === 'kpi-policy' ? 'policy' : intent,
        sources: documents.map((document) => document.id)
      });
    }

    const matchedFaq = faq.find((item) => item.keywords.some((keyword) => query.includes(normalize(keyword))));
    if (matchedFaq) return res.json({ reply: matchedFaq.answer, intent });

    const aiReply = await askAi({
      question: text,
      documents: searchHrDocuments(query),
    });
    if (aiReply) {
      return res.json({
        reply: aiReply,
        intent: intent === 'unknown' ? 'ai-assistant' : intent,
        provider: 'groq',
        model: process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile',
      });
    }

    return res.json({
      reply: 'Trợ lý AI chưa được cấu hình ở máy chủ. Mình chưa đủ thông tin để trả lời chính xác câu hỏi này. Bạn có thể hỏi cụ thể về: hồ sơ cá nhân, bảng lương, lịch sử chấm công, lịch sử nghỉ phép, số ngày phép, trạng thái đơn nghỉ phép (ví dụ LV-12), nhiệm vụ, chính sách nội bộ hoặc thống kê KPI đã ghi nhận.',
      intent
    });
  } catch (error) {
    console.error('Chatbot processing failed:', error.message);
    return res.status(500).json({ message: 'Không thể xử lý câu hỏi lúc này.' });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
