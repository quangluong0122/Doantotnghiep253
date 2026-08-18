import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Users, Calendar, DollarSign, CheckCircle, TrendingUp, Target, Award, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { 
      title: 'Tổng Nhân Viên', 
      value: '15', 
      icon: Users, 
      color: 'bg-blue-500',
      change: '+3 tháng này'
    },
    { 
      title: 'Đơn Nghỉ Phép', 
      value: '18', 
      icon: Calendar, 
      color: 'bg-yellow-500',
      change: '6 chờ duyệt'
    },
    { 
      title: 'Chi Phí Tháng Này', 
      value: '142M', 
      icon: DollarSign, 
      color: 'bg-green-500',
      change: '+8% so với tháng trước'
    },
    { 
      title: 'Lương Đã Thanh Toán', 
      value: '89%', 
      icon: CheckCircle, 
      color: 'bg-purple-500',
      change: '13/15 nhân viên'
    },
  ];

  // Leaves data
  const leavesData = [
    { id: 1, name: 'Nguyễn Văn A', type: 'Nghỉ phép', date: '10/01 - 12/01', days: 3, status: 'pending' },
    { id: 2, name: 'Trần Thị B', type: 'Nghỉ ốm', date: '08/01 - 09/01', days: 2, status: 'approved' },
    { id: 3, name: 'Lê Văn C', type: 'Nghỉ phép', date: '15/01 - 20/01', days: 6, status: 'pending' },
    { id: 4, name: 'Phạm Thị D', type: 'Nghỉ việc riêng', date: '07/01', days: 1, status: 'approved' },
    { id: 5, name: 'Hoàng Văn E', type: 'Nghỉ phép', date: '20/01 - 25/01', days: 6, status: 'pending' },
    { id: 6, name: 'Vũ Thị F', type: 'Nghỉ ốm', date: '05/01 - 06/01', days: 2, status: 'approved' },
    { id: 7, name: 'Đỗ Văn G', type: 'Nghỉ phép', date: '12/01 - 14/01', days: 3, status: 'pending' },
    { id: 8, name: 'Bùi Thị H', type: 'Nghỉ việc riêng', date: '09/01', days: 1, status: 'pending' },
    { id: 9, name: 'Đinh Văn I', type: 'Nghỉ phép', date: '25/01 - 28/01', days: 4, status: 'approved' },
    { id: 10, name: 'Mai Thị K', type: 'Nghỉ ốm', date: '18/01 - 19/01', days: 2, status: 'approved' },
  ];

  // Expenses data
  const expensesData = [
    { id: 1, category: 'Văn phòng phẩm', amount: 5000000, date: '05/01/2026', status: 'approved' },
    { id: 2, category: 'Điện nước', amount: 8000000, date: '01/01/2026', status: 'approved' },
    { id: 3, category: 'Marketing', amount: 15000000, date: '03/01/2026', status: 'pending' },
    { id: 4, category: 'Đào tạo', amount: 12000000, date: '02/01/2026', status: 'approved' },
    { id: 5, category: 'Văn phòng phẩm', amount: 3500000, date: '04/01/2026', status: 'approved' },
    { id: 6, category: 'Marketing', amount: 20000000, date: '06/01/2026', status: 'pending' },
    { id: 7, category: 'Du lịch công tác', amount: 25000000, date: '08/01/2026', status: 'approved' },
    { id: 8, category: 'Bảo hiểm', amount: 18000000, date: '10/01/2026', status: 'approved' },
    { id: 9, category: 'Văn phòng phẩm', amount: 6000000, date: '12/01/2026', status: 'pending' },
    { id: 10, category: 'Điện nước', amount: 7500000, date: '15/01/2026', status: 'approved' },
  ];

  // Salary data
  const salaryData = [
    { id: 1, month: '01/2026', totalSalary: 450000000, paidCount: 13, totalEmployees: 15, status: 'processing' },
    { id: 2, month: '12/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
    { id: 3, month: '11/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
    { id: 4, month: '10/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
    { id: 5, month: '09/2025', totalSalary: 450000000, paidCount: 14, totalEmployees: 15, status: 'paid' },
    { id: 6, month: '08/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
    { id: 7, month: '07/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
    { id: 8, month: '06/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
    { id: 9, month: '05/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
    { id: 10, month: '04/2025', totalSalary: 450000000, paidCount: 15, totalEmployees: 15, status: 'paid' },
  ];

  // State management
  const [leavesSearch, setLeavesSearch] = useState('');
  const [leavesPage, setLeavesPage] = useState(1);
  const [expensesSearch, setExpensesSearch] = useState('');
  const [expensesPage, setExpensesPage] = useState(1);
  const [salarySearch, setSalarySearch] = useState('');
  const [salaryPage, setSalaryPage] = useState(1);

  const itemsPerPage = 8;

  // Filter functions
  const getFilteredLeaves = () => {
    return leavesData.filter(leave =>
      leave.name.toLowerCase().includes(leavesSearch.toLowerCase()) ||
      leave.type.toLowerCase().includes(leavesSearch.toLowerCase()) ||
      leave.status.toLowerCase().includes(leavesSearch.toLowerCase())
    );
  };

  const getFilteredExpenses = () => {
    return expensesData.filter(exp =>
      exp.category.toLowerCase().includes(expensesSearch.toLowerCase()) ||
      exp.status.toLowerCase().includes(expensesSearch.toLowerCase())
    );
  };

  const getFilteredSalaries = () => {
    return salaryData.filter(sal =>
      sal.month.includes(salarySearch) ||
      sal.status.toLowerCase().includes(salarySearch.toLowerCase())
    );
  };

  // Paginate data
  const paginateData = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const filteredLeaves = getFilteredLeaves();
  const filteredExpenses = getFilteredExpenses();
  const filteredSalaries = getFilteredSalaries();

  const paginatedLeaves = paginateData(filteredLeaves, leavesPage);
  const paginatedExpenses = paginateData(filteredExpenses, expensesPage);
  const paginatedSalaries = paginateData(filteredSalaries, salaryPage);

  const totalLeavesPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const totalExpensesPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const totalSalaryPages = Math.ceil(filteredSalaries.length / itemsPerPage);

  const kpiSummary = {
    overallPercentage: 102,
    completedCount: 10,
    totalEmployees: 12,
    trend: '+5%'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const SearchInput = ({ value, onChange }) => (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg animate-slideUp">
      <div className="text-sm text-gray-600">
        Trang {currentPage} / {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Dashboard Quản Trị</h1>
          <p className="text-gray-600">Tổng quan hệ thống quản lý nhân viên</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-100"
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 100}ms backwards`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">{stat.change}</span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* KPI Summary Section */}
        <div className="mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tổng Quan KPI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 kpi-card-enter" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Hiệu suất chung</p>
                  <p className="text-4xl font-bold text-blue-600 mt-3">{kpiSummary.overallPercentage}%</p>
                  <p className="text-green-600 text-xs font-semibold mt-2">{kpiSummary.trend} so với quý trước</p>
                </div>
                <TrendingUp className="w-14 h-14 text-blue-300" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300 kpi-card-enter" style={{animationDelay: '0.3s'}}>
              <div>
                <p className="text-gray-600 text-sm font-medium">Chỉ tiêu hoàn thành</p>
                <p className="text-4xl font-bold text-green-600 mt-3">{kpiSummary.completedCount}/{kpiSummary.totalEmployees}</p>
                <p className="text-gray-600 text-xs font-medium mt-2">Nhân viên đạt/vượt mục tiêu</p>
              </div>
              <Award className="w-14 h-14 text-green-300 absolute right-6 top-6 opacity-50" />
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 relative kpi-card-enter" style={{animationDelay: '0.4s'}}>
              <div>
                <p className="text-gray-600 text-sm font-medium">Trạng thái hiệu suất</p>
                <p className="text-3xl font-bold text-purple-600 mt-3">
                  {kpiSummary.overallPercentage >= 100 ? '🎯 Vượt chỉ tiêu' : '📊 Trong kế hoạch'}
                </p>
                <p className="text-gray-600 text-xs font-medium mt-2">Tổng thể toàn công ty</p>
              </div>
              <Target className="w-14 h-14 text-purple-300 absolute right-6 top-6 opacity-50" />
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản Lý Đơn Nghỉ Phép</h2>
            <p className="text-gray-500 text-sm">Danh sách các đơn chờ xử lý</p>
          </div>
          <SearchInput 
            value={leavesSearch} 
            onChange={(val) => { setLeavesSearch(val); setLeavesPage(1); }}
          />
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Nhân Viên</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Loại</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Số Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeaves.map((leave, idx) => (
                  <tr key={leave.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-3 px-4 font-medium text-gray-800">{leave.name}</td>
                    <td className="py-3 px-4 text-gray-600">{leave.type}</td>
                    <td className="py-3 px-4 text-gray-600">{leave.date}</td>
                    <td className="py-3 px-4 font-medium">{leave.days} ngày</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 inline-block ${
                        leave.status === 'approved' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' 
                          : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {leave.status === 'approved' ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls 
            currentPage={leavesPage} 
            totalPages={totalLeavesPages}
            onPageChange={setLeavesPage}
          />
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản Lý Chi Phí</h2>
            <p className="text-gray-500 text-sm">Danh sách các chi phí tổng công ty</p>
          </div>
          <SearchInput 
            value={expensesSearch} 
            onChange={(val) => { setExpensesSearch(val); setExpensesPage(1); }}
          />
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Danh Mục</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Số Tiền</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense, idx) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-3 px-4 font-medium text-gray-800">{expense.category}</td>
                    <td className="py-3 px-4 font-semibold text-red-600">{formatCurrency(expense.amount)}</td>
                    <td className="py-3 px-4 text-gray-600">{expense.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                        expense.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status === 'approved' ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls 
            currentPage={expensesPage} 
            totalPages={totalExpensesPages}
            onPageChange={setExpensesPage}
          />
        </div>

        {/* Salary Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản Lý Lương Thưởng</h2>
            <p className="text-gray-500 text-sm">Lịch sử thanh toán lương nhân viên</p>
          </div>
          <SearchInput 
            value={salarySearch} 
            onChange={(val) => { setSalarySearch(val); setSalaryPage(1); }}
          />
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Tháng</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Tổng Lương</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Đã Thanh Toán</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSalaries.map((salary, idx) => (
                  <tr key={salary.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-3 px-4 font-medium text-gray-800">{salary.month}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{formatCurrency(salary.totalSalary)}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">
                        {salary.paidCount}/{salary.totalEmployees} nhân viên
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                        salary.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {salary.status === 'paid' ? '✓ Đã thanh toán' : '⚙️ Đang xử lý'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls 
            currentPage={salaryPage} 
            totalPages={totalSalaryPages}
            onPageChange={setSalaryPage}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        .table-row-enter {
          animation: slideInLeft 0.4s ease-out backwards;
        }
        .section-enter {
          animation: fadeIn 0.7s ease-out;
        }
        .kpi-card-enter {
          animation: scaleIn 0.5s ease-out;
        }
        tr {
          transition: all 0.3s ease;
        }
        tr:hover {
          transform: translateX(4px);
        }
      `}</style>
    </Layout>
  );
};

export default AdminDashboard;
