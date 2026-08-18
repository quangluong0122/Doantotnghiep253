import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Users, Lock } from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Register form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      // Login validation
      if (!username.trim()) {
        setError('Vui lòng nhập tên đăng nhập');
        return;
      }
      if (!password.trim()) {
        setError('Vui lòng nhập mật khẩu');
        return;
      }

      try {
        const result = await login(username, password);
        if (result.success) {
          navigate(`/${result.user.role}`);
        } else {
          setError(result.message || 'Đăng nhập thất bại');
        }
      } catch (err) {
        setError(err.message || 'Lỗi không xác định');
      }
    } else {
      // Register validation
      if (!fullName.trim()) {
        setError('Vui lòng nhập họ tên');
        return;
      }
      if (!email.trim()) {
        setError('Vui lòng nhập email');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Email không hợp lệ');
        return;
      }
      if (!username.trim()) {
        setError('Vui lòng nhập tên đăng nhập');
        return;
      }
      if (username.length < 3) {
        setError('Tên đăng nhập phải có ít nhất 3 ký tự');
        return;
      }
      if (!password.trim()) {
        setError('Vui lòng nhập mật khẩu');
        return;
      }
      if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }

      // Send registration to backend
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            fullName,
            email,
            role: 'employee'
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Đăng ký thất bại');
          return;
        }

        setSuccess(`Đăng ký thành công! Vui lòng kiểm tra email ${email} để xác nhận tài khoản.`);
        
        // Reset form
        setTimeout(() => {
          setFullName('');
          setEmail('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          setMode('login');
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError('Lỗi đăng ký: ' + (err.message || 'Không xác định'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white opacity-10 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 animate-fadeInScale">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
        </h1>
        <p className="text-center text-gray-500 mb-8">Hệ thống Quản lý Nhân viên</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name (Register only) */}
          {mode === 'register' && (
            <div className="group">
              <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-2">
                Họ tên
              </label>
              <input
                id="fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Nhập họ tên"
                required={mode === 'register'}
              />
            </div>
          )}

          {/* Email (Register only) */}
          {mode === 'register' && (
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Nhập email"
                required={mode === 'register'}
              />
            </div>
          )}

          {/* Username */}
          <div className="group">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div className="group">
              <label htmlFor="confirmpassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  id="confirmpassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Nhập lại mật khẩu"
                  required={mode === 'register'}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg animate-shake">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg animate-slideUp">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold transform hover:scale-105 active:scale-95"
          >
            {mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            {mode === 'login' 
              ? 'Chưa có tài khoản? ' 
              : 'Đã có tài khoản? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setSuccess('');
                setUsername('');
                setPassword('');
                setFullName('');
                setEmail('');
                setConfirmPassword('');
              }}
              className="text-indigo-600 font-semibold hover:text-indigo-700 underline"
            >
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
