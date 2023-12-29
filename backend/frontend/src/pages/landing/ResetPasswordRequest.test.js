import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import ResetPasswordRequest from './ResetPasswordRequest';

jest.mock('axios');

describe('ResetPasswordRequest', () => {
  it('should handle form submission and update state', async () => {
    axios.post.mockResolvedValue({ data: {} });
    const { getByLabelText, getByText, getByTestId } = render(<ResetPasswordRequest />);
    const emailInput = getByLabelText('Email:');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const sendCodeButton = getByText('Send Code');
    fireEvent.click(sendCodeButton);
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8000/user/passwordReset',
        { email: 'test@example.com' }
      );
    });
  });
});
