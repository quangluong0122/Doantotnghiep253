import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Search, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';

const ExpenseManagement = () => {
  const expenses = [
    { id: 1, category: 'Văn phòng phẩm', amount: 5000000, date: '05/01/2026', description: 'Mua máy in, giấy A4, bút viết', status: 'approved' },
    { id: 2, category: 'Điện nước', amount: 8000000, date: '01/01/2026', description: 'Hóa đơn tháng 12/2025', status: 'approved' },
    { id: 3, category: 'Marketing', amount: 15000000, date: '03/01/2026', description: 'Chi phí quảng cáo Facebook Ads', status: 'pending' },
    { id: 4, category: 'Đào tạo', amount: 12000000, date: '02/01/2026', description: 'Khóa học React Advanced cho team Dev', status: 'approved' },
    { id: 5, category: 'Văn phòng phẩm', amount: 3500000, date: '04/01/2026', description: 'Mua bàn ghế văn phòng mới', status: 'approved' },
    { id: 6, category: 'Marketing', amount: 20000000, date: '06/01/2026', description: 'Chi phí quảng cáo Google Ads', status: 'pending' },
    { id: 7, category: 'Khác', amount: 6000000, date: '01/01/2026', description: 'Thuê dịch vụ vệ sinh văn phòng', status: 'approved' },
    { id: 8, category: 'Điện nước', amount: 7500000, date: '01/01/2026', description: 'Tiền internet và điện thoại', status: 'approved' },
    { id: 9, category: 'Đào tạo', amount: 8000000, date: '03/01/2026', description: 'Workshop về UI/UX Design', status: 'approved' },
    { id: 10, category: 'Marketing', amount: 18000000, date: '05/01/2026', description: 'Tổ chức sự kiện khách hàng', status: 'pending' },
    { id: 11, category: 'Văn phòng phẩm', amount: 4200000, date: '04/01/2026', description: 'Mua laptop phụ kiện', status: 'approved' },
    { id: 12, category: 'Khác', amount: 10000000, date: '02/01/2026', description: 'Bảo hiểm văn phòng', status: 'approved' },
    { id: 13, category: 'Đào tạo', amount: 15000000, date: '06/01/2026', description: 'Khóa học AWS Cloud Practitioner', status: 'pending' },
    { id: 14, category: 'Marketing', amount: 9000000, date: '04/01/2026', description: 'In tờ rơi, banner quảng cáo', status: 'approved' },
    { id: 15, category: 'Khác', amount: 5500000, date: '05/01/2026', description: 'Sửa chữa máy lạnh văn phòng', status: 'approved' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    exp.date.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Layout>
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Chi Phí</h1>
        <p className="text-gray-600 mb-8">Quản lý chi phí hoạt động của công ty</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100" style={{animation: 'slideUp 0.5s ease-out 0ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng Chi Phí Tháng Này</p>
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
                {paginatedExpenses.map((expense, idx) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-4 px-4 text-gray-700">{expense.date}</td>
                    <td className="py-4 px-4 font-medium text-gray-800">{expense.category}</td>
                    <td className="py-4 px-4 text-blue-600 font-semibold">{formatCurrency(expense.amount)}</td>
                    <td className="py-4 px-4 text-gray-700 max-w-xs truncate">{expense.description}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                        expense.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {expense.status === 'approved' ? '✓ Đã duyệt' : '⏳ Chờ duyệt'}
                      </span>
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
