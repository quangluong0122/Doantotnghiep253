import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';

const initialFaq = [
  {
    q: 'Giờ làm việc là bao nhiêu?',
    a: 'Giờ làm việc tiêu chuẩn là 8:30 - 17:30 từ thứ Hai đến thứ Sáu. Nghỉ trưa 1 giờ.'
  },
  {
    q: 'Quy định về trang phục?',
    a: 'Trang phục công sở: lịch sự, không mặc quần áo có nội dung phản cảm. Thứ Sáu mặc casual (không quá xuề xòa).'
  },
  {
    q: 'Chế độ phúc lợi?',
    a: 'Công ty cung cấp bảo hiểm y tế, bảo hiểm xã hội theo quy định, lương tháng 13 tuỳ hiệu suất, và 12 ngày phép năm.'
  }
];

const mockLeaveBalances = {
  annual: 12,
  sick: 5,
  unpaid: 0
};

const mockLeaveRequests = [
  { id: 'LV-1001', type: 'annual', status: 'Đang chờ duyệt', reason: 'Du lịch', managerNote: '' },
  { id: 'LV-1002', type: 'sick', status: 'Đã phê duyệt', reason: 'Ốm', managerNote: 'Chúc bạn mau khỏe' },
  { id: 'LV-1003', type: 'annual', status: 'Đã từ chối', reason: 'Cần hoàn thiện tài liệu', managerNote: 'Thiếu thông tin chi tiết' }
];

const ChatbotSupport = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Tôi là Chatbot Hỗ trợ. Bạn cần giúp gì về chính sách nhân sự hoặc nghỉ phép? (vd: "quy trình nghỉ phép", "số ngày phép còn lại", "trạng thái đơn LV-1001")', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const chatRef = useRef(null);

  const sampleQuestions = [
    'Quy trình nghỉ phép',
    'Số ngày phép còn lại',
    'Trạng thái đơn LV-1001',
    'Chế độ phúc lợi',
    'Quy định về trang phục'
  ];

  const pushMessage = (msg) => {
    setMessages((m) => [...m, { ...msg, time: new Date() }]);
  };

  const botReply = (text) => {
    // Very simple intent matching
    const lower = text.toLowerCase();

    // Check for leave balance request
    if (lower.includes('số ngày') || lower.includes('còn lại') || lower.includes('ngày phép')) {
      return `Bạn còn ${mockLeaveBalances.annual} ngày phép năm, ${mockLeaveBalances.sick} ngày phép ốm, và ${mockLeaveBalances.unpaid} ngày phép không lương.`;
    }

    // Check for leave request status
    const idMatch = text.match(/lv-?\s*(\d+)/i);
    if (idMatch) {
      const id = `LV-${idMatch[1]}`;
      const req = mockLeaveRequests.find(r => r.id.toLowerCase() === id.toLowerCase());
      if (req) {
        return `Đơn ${req.id}: Trạng thái "${req.status}". Lý do: ${req.reason}. Ghi chú quản lý: ${req.managerNote || 'Không có'}.`;
      }
      return `Không tìm thấy đơn với mã ${id}. Vui lòng kiểm tra mã và thử lại.`;
    }

    // Leave process
    if (lower.includes('quy trình nghỉ') || lower.includes('nộp đơn nghỉ')) {
      return 'Quy trình nghỉ phép: 1) Vào trang Nghỉ Phép > Tạo đơn mới; 2) Chọn loại phép và thời gian; 3) Ghi lý do và đính kèm (nếu có); 4) Gửi và chờ quản lý phê duyệt.';
    }

    // Policies / FAQ
    if (lower.includes('chính sách') || lower.includes('quy định') || lower.includes('phúc lợi') || lower.includes('giờ làm')) {
      const faqs = initialFaq.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
      return `Dưới đây là một số thông tin thường gặp:\n\n${faqs}`;
    }

    // Fallback
    return 'Xin lỗi, tôi chưa hiểu. Bạn có thể hỏi về: "chính sách", "quy trình nghỉ phép", "số ngày phép còn lại", hoặc "trạng thái đơn <MÃ ĐƠN>".';
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    pushMessage({ from: 'user', text });
    setInput('');
    setLoadingReply(true);

    // simulate async reply
    setTimeout(() => {
      const reply = botReply(text);
      pushMessage({ from: 'bot', text: reply });
      setLoadingReply(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSampleClick = (q) => {
    setInput(q);
    // small delay then send
    setTimeout(() => {
      pushMessage({ from: 'user', text: q });
      setLoadingReply(true);
      const reply = botReply(q);
      setTimeout(() => {
        pushMessage({ from: 'bot', text: reply });
        setLoadingReply(false);
      }, 600);
    }, 150);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto h-screen flex flex-col">
        <h1 className="text-2xl font-bold mb-2">Chatbot Hỗ trợ</h1>
        <p className="text-sm text-gray-600 mb-3">Hỗ trợ 24/7 về chính sách nhân sự, quy trình nghỉ phép, kiểm tra số ngày phép và tra cứu trạng thái đơn.</p>

        <div className="bg-white rounded-lg shadow p-4 flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
          {/* Suggestions panel */}
          <div className="col-span-1 border-r pr-2 overflow-y-auto">
            <h3 className="font-semibold mb-2">Câu hỏi mẫu</h3>
            <div className="space-y-2">
              {sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSampleClick(q)}
                  className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded border"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">Nhấp vào câu hỏi mẫu để gửi nhanh.</div>
          </div>

          {/* Chat area */}
          <div className="col-span-1 md:col-span-3 flex flex-col overflow-hidden">
            <div ref={chatRef} className="flex-1 overflow-auto p-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`mb-3 flex ${m.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`${m.from === 'bot' ? 'bg-gray-100 text-gray-900' : 'bg-blue-600 text-white'} p-3 rounded-lg max-w-[80%] shadow-sm`}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    <div className="text-[10px] text-gray-400 mt-1 text-right">{m.time ? new Date(m.time).toLocaleTimeString() : ''}</div>
                  </div>
                </div>
              ))}
              {loadingReply && (
                <div className="mb-2 flex justify-start">
                  <div className="bg-gray-100 text-gray-900 p-2 rounded-lg animate-pulse">...</div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 mt-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 p-2 border rounded h-12 resize-none"
                placeholder="Gõ câu hỏi của bạn, ví dụ: 'Quy trình nghỉ phép' hoặc 'Số ngày phép còn lại'"
              />
              <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Gửi</button>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2">Lưu ý: Đây là chatbot phiên bản demo — thông tin ngày phép và đơn là dữ liệu mô phỏng. Để thao tác thực tế (tạo đơn, thay đổi), sử dụng chức năng Nghỉ Phép trong ứng dụng.</div>
      </div>
    </Layout>
  );
};

export default ChatbotSupport;
