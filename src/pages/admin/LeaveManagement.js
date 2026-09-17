import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { CheckCircle, XCircle, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ApiService from '../../services/ApiService';

const leaveTypeLabels = {
  annual: 'Nghỉ phép năm',
  sick: 'Nghỉ ốm',
  personal: 'Nghỉ việc riêng',
  unpaid: 'Nghỉ không lương',
};

const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeaveRequests = async () => {
    const rows = await ApiService.getLeaves();
    setLeaveRequests(rows.map((leave) => ({
      ...leave,
      employeeId: leave.employee_id,
      employeeName: leave.employee_name || 'Không rõ nhân viên',
      leaveType: leaveTypeLabels[leave.leave_type] || leave.leave_type,
      startDate: formatDate(leave.start_date),
      endDate: formatDate(leave.end_date),
      days: Math.floor((new Date(leave.end_date) - new Date(leave.start_date)) / 86400000) + 1,
      requestDate: formatDate(leave.created_at),
    })));
  };

  useEffect(() => {
    loadLeaveRequests().catch(() => setLeaveRequests([])).finally(() => setLoading(false));
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleApprove = async (id) => {
    try {
      await ApiService.updateLeave(id, 'approved');
      await loadLeaveRequests();
      alert('Đã chấp nhận đơn nghỉ phép');
    } catch (error) { alert(error.message); }
  };

  const handleReject = async (id) => {
    try {
      await ApiService.updateLeave(id, 'rejected');
      await loadLeaveRequests();
      alert('Đã từ chối đơn nghỉ phép');
    } catch (error) { alert(error.message); }
  };

  const filteredRequests = leaveRequests.filter(req =>
    req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);


  const stats = {
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Nghỉ Phép</h1>
        <p className="text-gray-600 mb-8">Quản lý và phê duyệt các đơn nghỉ phép của nhân viên</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 rounded-2xl shadow-lg p-6 border border-yellow-100" style={{animation: 'slideUp 0.5s ease-out 0ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chờ Duyệt</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl shadow-lg p-6 border border-green-100" style={{animation: 'slideUp 0.5s ease-out 100ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đã Duyệt</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl shadow-lg p-6 border border-red-100" style={{animation: 'slideUp 0.5s ease-out 200ms backwards'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Từ Chối</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo nhân viên, loại, lý do, trạng thái..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 section-enter" style={{animationDelay: '0.2s'}}>
          <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Nhân Viên</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Loại</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Thời Gian</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Số Ngày</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Lý Do</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Trạng Thái</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-bold">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="7" className="py-8 text-center text-gray-500">Đang tải đơn nghỉ phép...</td></tr>}
                {!loading && paginatedRequests.length === 0 && <tr><td colSpan="7" className="py-8 text-center text-gray-500">Chưa có đơn nghỉ phép nào.</td></tr>}
                {paginatedRequests.map((request, idx) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50 transition-all duration-200 table-row-enter" style={{animationDelay: `${idx * 40}ms`}}>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-800">{request.employeeName}</div>
                        <div className="text-sm text-gray-500">{request.employeeId}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{request.leaveType}</td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-800">{request.startDate}</div>
                        <div className="text-gray-500">đến {request.endDate}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{request.days} ngày</td>
                    <td className="py-4 px-4 text-gray-700 max-w-xs truncate">{request.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {request.status === 'approved' ? '✓ Đã duyệt' : 
                         request.status === 'rejected' ? '✗ Từ chối' : '⏳ Chờ duyệt'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            title="Chấp nhận"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            title="Từ chối"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
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

export default LeaveManagement;
