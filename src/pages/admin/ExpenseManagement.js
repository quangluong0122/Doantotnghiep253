import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Search, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import ApiService from '../../services/ApiService';

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [summary, setSummary] = useState({ total_amount: 0, approved_amount: 0 });
  const itemsPerPage = 8;

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const [expenseRows, expenseSummary] = await Promise.all([
        ApiService.getExpenses(),
        ApiService.getExpenseSummary(selectedMonth),
      ]);
      setExpenses(expenseRows);
      setSummary(expenseSummary);
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Không thể tải danh sách chi phí');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleExpenseStatus = async (id, status) => {
    try {
      await ApiService.updateExpense(id, status);
      setExpenses((current) => current.map((expense) =>
        expense.id === id ? { ...expense, status } : expense
      ));
    } catch (updateError) {
      setError(updateError.message || 'Không thể cập nhật chi phí');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(exp.date || '').includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const totalExpenses = Number(summary.total_amount) || 0;
  const approvedExpenses = Number(summary.approved_amount) || 0;

  return (
    <Layout>
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Chi Phí</h1>
        <p className="text-gray-600 mb-8">Quản lý chi phí hoạt động của công ty</p>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-gray-800">Tổng hợp chi phí</h2>
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            Chọn tháng
            <input
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100" style={{animation: 'slideUp 0.5s ease-out 0ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng Chi Phí Tháng Đã Chọn</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalExpenses)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl shadow-lg p-6 border border-green-100" style={{animation: 'slideUp 0.5s ease-out 100ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chi Phí Đã Duyệt</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(approvedExpenses)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo danh mục, mô tả, trạng thái, ngày..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Expenses Table */}
        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 section-enter" style={{animationDelay: '0.2s'}}>
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Danh Mục</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Số Tiền</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Mô Tả</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="5" className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>}
                {!loading && paginatedExpenses.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-gray-500">Chưa có dữ liệu chi phí</td></tr>}
                {paginatedExpenses.map((expense, idx) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-4 px-4 text-gray-700">{new Date(expense.date).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4 px-4 font-medium text-gray-800">{expense.category}</td>
                    <td className="py-4 px-4 text-blue-600 font-semibold">{formatCurrency(expense.amount)}</td>
                    <td className="py-4 px-4 text-gray-700 max-w-xs truncate">{expense.description}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                        expense.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : expense.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {['approved', 'paid'].includes(expense.status) ? '✓ Đã duyệt' : expense.status === 'rejected' ? '✕ Từ chối' : '⏳ Chờ duyệt'}
                      </span>
                      {expense.status === 'pending' && <div className="mt-2 flex gap-2">
                        <button onClick={() => handleExpenseStatus(expense.id, 'approved')} className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700">Duyệt</button>
                        <button onClick={() => handleExpenseStatus(expense.id, 'rejected')} className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700">Từ chối</button>
                      </div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg animate-slideUp">
            <div className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
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
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .section-enter {
          animation: fadeIn 0.7s ease-out;
        }
        .table-row-enter {
          animation: slideInLeft 0.4s ease-out backwards;
        }
      `}</style>
    </Layout>
  );
};

export default ExpenseManagement;
