import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext');

describe('ProtectedRoute', () => {
  test('shows loading state while authentication is loading', () => {
    useAuth.mockReturnValue({ loading: true, user: null });
    render(<MemoryRouter><ProtectedRoute><div>Private content</div></ProtectedRoute></MemoryRouter>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirects unauthenticated users to login', () => {
    useAuth.mockReturnValue({ loading: false, user: null });
    render(<MemoryRouter initialEntries={['/private']}><ProtectedRoute><div>Private content</div></ProtectedRoute></MemoryRouter>);
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });

  test('redirects users with the wrong role', () => {
    useAuth.mockReturnValue({ loading: false, user: { role: 'employee' } });
    render(<MemoryRouter initialEntries={['/admin']}><ProtectedRoute role="admin"><div>Admin content</div></ProtectedRoute></MemoryRouter>);
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  test('renders protected content for an authorized user', () => {
    useAuth.mockReturnValue({ loading: false, user: { role: 'admin' } });
    render(<MemoryRouter><ProtectedRoute role="admin"><div>Admin content</div></ProtectedRoute></MemoryRouter>);
    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });
});
