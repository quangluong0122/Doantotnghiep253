import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { TrendingUp, Briefcase, Calendar, Award, Plus, Eye } from 'lucide-react';

const WorkHistory = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const workHistoryData = [
    {
      id: 1,
      employeeId: 'EMP001',
      employeeName: 'Nguyễn Văn A',
      type: 'promotion',
      event: 'Thăng chức',
      fromPosition: 'Junior Developer',
      toPosition: 'Senior Developer',
      date: '01/01/2026',
      reason: 'Hoàn thành xuất sắc dự án lớn',
      salaryChange: '+5,000,000 VNĐ'
    },
    {
      id: 2,
      employeeId: 'EMP003',
      employeeName: 'Lê Văn C',
      type: 'promotion',
      event: 'Thăng chức',
      fromPosition: 'Team Leader',
      toPosition: 'Project Manager',
      date: '15/12/2025',
      reason: 'Quản lý team hiệu quả, đạt KPI cao',
      salaryChange: '+7,000,000 VNĐ'
    },
    {
      id: 3,
      employeeId: 'EMP007',
      employeeName: 'Đỗ Văn G',
      type: 'transfer',
      event: 'Chuyển phòng ban',
      fromPosition: 'Backend Developer (IT)',
      toPosition: 'DevOps Engineer (IT)',
      date: '20/11/2025',
      reason: 'Chuyển sang vị trí phù hợp với năng lực',
      salaryChange: '+1,000,000 VNĐ'
    },
    {
      id: 4,
      employeeId: 'EMP002',
      employeeName: 'Trần Thị B',
      type: 'award',
      event: 'Nhận thưởng',
      fromPosition: 'UI/UX Designer',
      toPosition: 'UI/UX Designer',
      date: '01/12/2025',
      reason: 'Nhân viên xuất sắc tháng 11/2025',
      salaryChange: 'Thưởng 3,000,000 VNĐ'
    },
    {
      id: 5,
      employeeId: 'EMP014',
      employeeName: 'Cao Thị O',
      type: 'promotion',
      event: 'Thăng chức',
      fromPosition: 'Business Analyst',
      toPosition: 'Product Owner',
      date: '01/11/2025',
      reason: 'Đề xuất và thực hiện thành công nhiều sản phẩm',
      salaryChange: '+6,000,000 VNĐ'
    },
    {
      id: 6,
      employeeId: 'EMP005',
      employeeName: 'Hoàng Văn E',
      type: 'salary_increase',
      event: 'Tăng lương',
      fromPosition: 'Frontend Developer',
      toPosition: 'Frontend Developer',
      date: '01/10/2025',
      reason: 'Đánh giá hiệu suất công việc 6 tháng',
      salaryChange: '+2,000,000 VNĐ'
    },
    {
      id: 7,
      employeeId: 'EMP009',
      employeeName: 'Đinh Văn I',
      type: 'transfer',
      event: 'Chuyển phòng ban',
      fromPosition: 'HR Staff (HR)',
      toPosition: 'HR Manager (HR)',
      date: '15/09/2025',
      reason: 'Thăng tiến nội bộ phòng ban',
      salaryChange: '+4,000,000 VNĐ'
    },
    {
      id: 8,
      employeeId: 'EMP010',
      employeeName: 'Mai Thị K',
      type: 'award',
      event: 'Nhận thưởng',
      fromPosition: 'Marketing Manager',
      toPosition: 'Marketing Manager',
      date: '01/09/2025',
      reason: 'Chiến dịch marketing thành công vượt kỳ vọng',
      salaryChange: 'Thưởng 5,000,000 VNĐ'
    },
    {
      id: 9,
      employeeId: 'EMP006',
      employeeName: 'Vũ Thị F',
      type: 'salary_increase',
      event: 'Tăng lương',
      fromPosition: 'QA Tester',
      toPosition: 'QA Tester',
      date: '01/08/2025',
      reason: 'Làm việc chăm chỉ, tìm ra nhiều bug quan trọng',
      salaryChange: '+1,500,000 VNĐ'
    },
    {
      id: 10,
      employeeId: 'EMP013',
      employeeName: 'Phan Văn N',
      type: 'promotion',
      event: 'Thăng chức',
      fromPosition: 'Junior BA',
      toPosition: 'Business Analyst',
      date: '01/07/2025',
      reason: 'Hoàn thành tốt giai đoạn thử việc',
      salaryChange: '+3,000,000 VNĐ'
    },
  ];

  const employees = [
    { id: 'all', name: 'Tất cả nhân viên' },
    { id: 'EMP001', name: 'Nguyễn Văn A' },
    { id: 'EMP002', name: 'Trần Thị B' },
    { id: 'EMP003', name: 'Lê Văn C' },
    { id: 'EMP005', name: 'Hoàng Văn E' },
    { id: 'EMP006', name: 'Vũ Thị F' },
    { id: 'EMP007', name: 'Đỗ Văn G' },
    { id: 'EMP009', name: 'Đinh Văn I' },
    { id: 'EMP010', name: 'Mai Thị K' },
    { id: 'EMP013', name: 'Phan Văn N' },
    { id: 'EMP014', name: 'Cao Thị O' },
  ];

  const filteredData = selectedEmployee === 'all' 
    ? workHistoryData 
    : workHistoryData.filter(record => record.employeeId === selectedEmployee);

  const getEventColor = (type) => {
    switch (type) {
      case 'promotion':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'transfer':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'salary_increase':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'award':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'promotion':
        return <TrendingUp className="w-5 h-5" />;
      case 'transfer':
        return <Briefcase className="w-5 h-5" />;
      case 'salary_increase':
        return <Award className="w-5 h-5" />;
      case 'award':
        return <Award className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const stats = {
    promotions: workHistoryData.filter(r => r.type === 'promotion').length,
    transfers: workHistoryData.filter(r => r.type === 'transfer').length,
    salaryIncreases: workHistoryData.filter(r => r.type === 'salary_increase').length,
    awards: workHistoryData.filter(r => r.type === 'award').length,
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Lịch Sử Công Tác</h1>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Thêm Ghi Chú</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Thăng Chức</p>
                <p className="text-3xl font-bold text-green-600">{stats.promotions}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Chuyển Phòng Ban</p>
                <p className="text-3xl font-bold text-blue-600">{stats.transfers}</p>
              </div>
              <Briefcase className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tăng Lương</p>
                <p className="text-3xl font-bold text-purple-600">{stats.salaryIncreases}</p>
              </div>
              <Award className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Khen Thưởng</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.awards}</p>
              </div>
              <Award className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Lọc theo nhân viên:</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Work History Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Dòng Thời Gian</h2>
          
          <div className="space-y-6">
            {filteredData.map((record, index) => (
              <div key={record.id} className="relative">
                {index !== filteredData.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${getEventColor(record.type)}`}>
                    {getEventIcon(record.type)}
                  </div>
                  
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{record.event}</h3>
                        <p className="text-sm text-gray-600">
                          {record.employeeName} ({record.employeeId})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{record.date}</p>
                        <button
                          onClick={() => navigate(`/admin/employees/${record.employeeId.replace('EMP', '')}`)}
                          className="mt-1 text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Xem chi tiết</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Từ:</p>
                        <p className="font-medium text-gray-800">{record.fromPosition}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Đến:</p>
                        <p className="font-medium text-gray-800">{record.toPosition}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Lý do:</p>
                      <p className="text-sm text-gray-700">{record.reason}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventColor(record.type)}`}>
                        {record.event}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {record.salaryChange}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkHistory;
