// Remove trailing slash from API_BASE_URL to avoid double slashes
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔍 DEBUG: REACT_APP_API_URL =', process.env.REACT_APP_API_URL);
  console.log('🔍 DEBUG: API_BASE_URL =', API_BASE_URL);
}

const ApiService = {
  // Auth endpoints
  login: async (username, password) => {
    console.log('📤 Sending login request to:', `${API_BASE_URL}/auth/login`);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }
    return data;
  },

  register: async (username, password, name, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name, role }),
    });
    return response.json();
  },

  // Helper function to get auth header
  getAuthHeader: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Employees
  getEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  getEmployee: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  createEmployee: async (data) => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateEmployee: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteEmployee: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  // Leaves
  getLeaves: async () => {
    const response = await fetch(`${API_BASE_URL}/leaves`, {
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  createLeave: async (data) => {
    const response = await fetch(`${API_BASE_URL}/leaves`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateLeave: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/leaves/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Attendance
  getAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  checkIn: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/checkin`, {
      method: 'POST',
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  checkOut: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/checkout`, {
      method: 'POST',
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  // Salary
  getSalaries: async () => {
    const response = await fetch(`${API_BASE_URL}/salary`, {
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  updateSalary: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/salary/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Expenses
  getExpenses: async () => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  createExpense: async (data) => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateExpense: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // KPI
  getKPIs: async () => {
    const response = await fetch(`${API_BASE_URL}/kpi`, {
      headers: ApiService.getAuthHeader(),
    });
    return response.json();
  },

  createKPI: async (data) => {
    const response = await fetch(`${API_BASE_URL}/kpi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateKPI: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/kpi/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...ApiService.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default ApiService;
