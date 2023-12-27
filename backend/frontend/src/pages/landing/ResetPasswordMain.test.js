import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordMain from './ResetPasswordMain';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ResetPasswordMain', () => {
  let originalConsoleLog;

  beforeEach(() => {
    originalConsoleLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('submits the form and shows success message', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    render(
      <MemoryRouter initialEntries={[`/reset-password/token123/uid123`]}>
        <Routes>
          <Route path="/reset-password/:token/:uidb64" element={<ResetPasswordMain />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/New Password:/i), {
      target: { value: 'newpassword123' },
    });
    fireEvent.click(screen.getByText(/Submit/i));
    await waitFor(() => {
      expect(screen.getByText(/Password has been reset/i)).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('handles form submission error', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Error message' } } });
    const mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    render(
      <MemoryRouter initialEntries={[`/reset-password/token123/uid123`]}>
        <Routes>
          <Route path="/reset-password/:token/:uidb64" element={<ResetPasswordMain />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/New Password:/i), {
      target: { value: 'newpassword123' },
    });
    fireEvent.click(screen.getByText(/Submit/i));
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith({ message: 'Error message' });
    });
  });
});
