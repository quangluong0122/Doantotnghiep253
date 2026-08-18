import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  Wallet,
  History,
  Briefcase,
  Target,
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  // Get avatar from localStorage
  const [selectedAvatar] = useState(() => {
    const saved = localStorage.getItem(`userAvatar_${user?.username}`);
    return saved ? parseInt(saved) : 0;
  });
  const [customAvatarUrl] = useState(() => {
    return localStorage.getItem(`customAvatarUrl_${user?.username}`) || null;
  });

  const avatarOptions = Array.from({ length: 30 }, (_, i) => 
    `https://i.pravatar.cc/150?img=${i}`
  );

  const getCurrentAvatarUrl = () => {
    return customAvatarUrl || avatarOptions[selectedAvatar];
  };

  const handleAvatarClick = () => {
    navigate('/account');
  };

  const menuItems = user?.role === 'admin' 
    ? [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/employees', icon: Users, label: 'Nhân Viên' },
        { path: '/admin/leaves', icon: Calendar, label: 'Nghỉ Phép' },
        { path: '/admin/expenses', icon: Wallet, label: 'Chi Phí' },
        { path: '/admin/salary', icon: DollarSign, label: 'Lương Thưởng' },
        { path: '/admin/work-history', icon: Briefcase, label: 'Lịch Sử Công Tác' },
        { path: '/admin/kpi', icon: Target, label: 'Quản Lý KPI' },
        { path: '/support/chatbot', icon: MessageCircle, label: 'Chatbot Hỗ trợ' },
      ]
    : [
        { path: '/employee', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/employee/leaves', icon: Calendar, label: 'Nghỉ Phép' },
        { path: '/employee/attendance-history', icon: History, label: 'Lịch Sử Chấm Công' },
        { path: '/employee/kpi', icon: Target, label: 'KPI Của Tôi' },
        { path: '/support/chatbot', icon: MessageCircle, label: 'Chatbot Hỗ trợ' },
      ];

  return (
    <>
      <div className={`${isOpen ? 'w-64' : 'w-20'} fixed transition-all duration-300 bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-800 text-white h-screen flex flex-col shadow-2xl z-40`}>
        {/* User Profile Section */}
        <div className="p-4 border-b border-indigo-500">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isOpen ? 'space-x-3' : 'flex-col space-y-2'}`}>
              <button
                onClick={handleAvatarClick}
                className="focus:outline-none hover:opacity-80 transition"
                title="Click để xem thông tin tài khoản"
              >
                <img 
                  src={getCurrentAvatarUrl()}
                  alt={user?.name}
                  className="w-12 h-12 rounded-full border-2 border-white object-cover cursor-pointer"
                />
              </button>
              {isOpen && (
                <button
                  onClick={handleAvatarClick}
                  className="min-w-0 flex-1 text-left hover:opacity-80 transition"
                  title="Click để xem thông tin tài khoản"
                >
                  <p className="font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-indigo-200 truncate capitalize">{user?.role}</p>
                </button>
              )}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 hover:bg-indigo-500 rounded-lg transition-all duration-200"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isActive 
                    ? 'bg-white text-indigo-700 shadow-lg font-semibold' 
                    : 'hover:bg-indigo-500 text-indigo-100'
                }`}
                style={{
                  animationDelay: `${idx * 50}ms`
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
