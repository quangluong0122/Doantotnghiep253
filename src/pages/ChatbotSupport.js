import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import ApiService from '../services/ApiService';

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

  const handleSend = async (presetText = input) => {
    const text = presetText.trim();
    if (!text) return;
    pushMessage({ from: 'user', text });
    setInput('');
    setLoadingReply(true);
    try {
      const result = await ApiService.sendChatbotMessage(text);
      pushMessage({ from: 'bot', text: result.reply });
    } catch (error) {
      pushMessage({ from: 'bot', text: error.message || 'Không thể kết nối chatbot lúc này.' });
    } finally {
      setLoadingReply(false);
    }
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
    handleSend(q);
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

        <div className="text-xs text-gray-500 mt-2">Chatbot sử dụng chính sách nội bộ và dữ liệu cá nhân của tài khoản đang đăng nhập. Để tạo hoặc thay đổi đơn, sử dụng chức năng Nghỉ phép.</div>
      </div>
    </Layout>
  );
};

export default ChatbotSupport;
