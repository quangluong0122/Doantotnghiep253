import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ApiService from '../../services/ApiService';

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    ApiService.getAttendance().then((rows) => setAttendance(rows.map((row) => ({
      ...row,
      date: row.check_in_date,
      checkIn: row.check_in_time ? new Date(row.check_in_time).toLocaleTimeString('vi-VN') : 'N/A',
      checkOut: row.check_out_time ? new Date(row.check_out_time).toLocaleTimeString('vi-VN') : 'N/A',
      status: row.status === 'present' ? 'on-time' : row.status,
      duration: row.work_duration || '-'
    })))).catch(() => setAttendance([]));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredAttendance = attendance.filter(record =>
    record.date.includes(searchTerm) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedAttendance = filteredAttendance.slice(startIdx, endIdx);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'on-time':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Đúng giờ</span>;
      case 'late':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">Muộn</span>;
      case 'absent':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">Vắng mặt</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{status}</span>;
    }
  };

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Lịch Sử Chấm Công</h1>
          <p className="text-gray-600 mt-2">Xem các bản ghi chấm công và thời gian làm việc của bạn</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ngày, trạng thái..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Ngày</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Giờ Vào</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Giờ Ra</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Thời Gian Làm Việc</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold">Trạng Thái</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {paginatedAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{new Date(record.date).toLocaleDateString('vi-VN')}</td>
                    <td className="py-4 px-6">{record.checkIn}</td>
                    <td className="py-4 px-6">{record.checkOut}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {record.duration}
                      </span>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(record.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-600">
            Hiển thị {startIdx + 1}-{Math.min(endIdx, filteredAttendance.length)} / {filteredAttendance.length} bản ghi
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

export default AttendanceHistory;
