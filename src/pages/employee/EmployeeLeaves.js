import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ApiService from '../../services/ApiService';

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    ApiService.getLeaves().then((rows) => setLeaves(rows.map((leave) => ({
      ...leave,
      type: leave.leave_type,
      startDate: leave.start_date,
      endDate: leave.end_date,
      days: Math.floor((new Date(leave.end_date) - new Date(leave.start_date)) / 86400000) + 1
    })))).catch(() => setLeaves([]));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredLeaves = leaves.filter(leave =>
    leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedLeaves = filteredLeaves.slice(startIdx, endIdx);

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Đã duyệt</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Chờ duyệt</span>;
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Đơn Nghỉ Phép Của Tôi</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Gửi Đơn Nghỉ Phép</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo loại, lý do, trạng thái..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Leave Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Loại Nghỉ</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Ngày Bắt Đầu</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Ngày Kết Thúc</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Số Ngày</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Lý Do</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Trạng Thái</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {paginatedLeaves.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-500">Bạn chưa có đơn nghỉ phép nào.</td></tr>}
                {paginatedLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{leave.type}</td>
                    <td className="py-4 px-6">{new Date(leave.startDate).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4 px-6">{new Date(leave.endDate).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {leave.days} ngày
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{leave.reason}</td>
                    <td className="py-4 px-6">{getStatusBadge(leave.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-600">
            Hiển thị {startIdx + 1}-{Math.min(endIdx, filteredLeaves.length)} / {filteredLeaves.length} đơn
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeLeaves;
