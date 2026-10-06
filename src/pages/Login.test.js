import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

const mockNavigate = jest.fn();

jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useAuth.mockReturnValue({ login: jest.fn(), user: null });
    global.fetch = jest.fn();
  });

  afterEach(() => jest.restoreAllMocks());

  const renderLogin = () => render(<MemoryRouter><Login /></MemoryRouter>);

  test('validates empty login fields', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
    expect(screen.getByText('Vui lòng nhập tên đăng nhập')).toBeInTheDocument();
  });

  test('navigates to the role dashboard after successful login', async () => {
    const login = jest.fn().mockResolvedValue({ success: true, user: { role: 'admin' } });
    useAuth.mockReturnValue({ login, user: null });
    renderLogin();
    fireEvent.change(screen.getByLabelText('Tên đăng nhập'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin'));
    expect(login).toHaveBeenCalledWith('admin', 'admin123');
  });

  test('validates registration email and password confirmation', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));
    fireEvent.change(screen.getByLabelText('Họ tên'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));
    expect(screen.getByText('Email không hợp lệ')).toBeInTheDocument();
  });

  test('submits a valid registration and shows success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true }),
    });
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));
    fireEvent.change(screen.getByLabelText('Họ tên'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Tên đăng nhập'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'secret123' } });
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));
    await waitFor(() => expect(screen.getByText(/Đăng ký thành công/i)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/register'), expect.objectContaining({ method: 'POST' }));
  });
});
