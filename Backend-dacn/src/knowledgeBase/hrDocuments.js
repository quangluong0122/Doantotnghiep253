export const hrDocuments = [
  {
    id: 'leave-policy',
    title: 'Chính sách nghỉ phép',
    content: 'Nhân viên có 12 ngày phép năm theo hạn mức mẫu. Đơn nghỉ cần có loại phép, thời gian và lý do; đơn chỉ có hiệu lực sau khi được phê duyệt.',
    keywords: ['nghi phep', 'phep nam', 'don nghi', 'phe duyet']
  },
  {
    id: 'working-hours',
    title: 'Thời gian làm việc',
    content: 'Giờ làm việc tiêu chuẩn là 8:30 đến 17:30 từ thứ Hai đến thứ Sáu, nghỉ trưa 1 giờ. Nhân viên cần chấm công khi bắt đầu và kết thúc ngày làm việc.',
    keywords: ['gio lam', 'thoi gian lam', 'cham cong', 'di lam']
  },
  {
    id: 'kpi-policy',
    title: 'Quy định KPI',
    content: 'KPI gồm chỉ tiêu, kết quả thực tế và kỳ đánh giá theo tháng. Điểm thống kê được tính từ actual chia cho target; chatbot chỉ hiển thị dữ liệu thống kê hiện có, không dự đoán hiệu suất tương lai.',
    keywords: ['kpi', 'hieu suat', 'chi tieu', 'du doan']
  },
  {
    id: 'account-security',
    title: 'Bảo mật tài khoản',
    content: 'Không chia sẻ mật khẩu hoặc token. Đăng xuất sau khi sử dụng máy dùng chung và liên hệ quản trị viên khi phát hiện hoạt động bất thường.',
    keywords: ['bao mat', 'mat khau', 'tai khoan', 'token']
  }
];

const tokenize = (value) => value.split(/\s+/).filter(Boolean);

export const searchHrDocuments = (query, limit = 2) => {
  const terms = new Set(tokenize(query));
  return hrDocuments
    .map((document) => {
      const searchable = new Set(tokenize(`${document.title} ${document.content} ${document.keywords.join(' ')}`));
      const score = [...terms].filter((term) => searchable.has(term)).length;
      return { document, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ document }) => document);
};
