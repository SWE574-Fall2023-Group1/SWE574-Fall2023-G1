import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

// Mock Axios
jest.mock('axios');

// Mock react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe('Login component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Login component', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    // ... rest of your assertions
  });

  test('calls axios.post with correct credentials on form submission', async () => {
    axios.post.mockResolvedValue({ status: 201 });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'aykutk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345aykut' } });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/user/login',
        { username: 'aykutk', password: '12345aykut' },
        { withCredentials: true }
      );
    });
  });

  test('handles successful login', async () => {
    axios.post.mockResolvedValue({ status: 201 });

    const onLoginSuccess = jest.fn();

    render(
      <MemoryRouter>
        <Login onLoginSuccess={onLoginSuccess} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    });
    await act(async () => {
        expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
      });
  });
});
