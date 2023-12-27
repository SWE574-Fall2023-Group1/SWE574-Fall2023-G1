import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Logout from './Logout';

jest.mock('axios');

describe('LogoutButton', () => {
  it('should handle logout button click', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockResolvedValue({ data: { success: true } });
    const { getByText } = render(<Logout />);
    fireEvent.click(getByText('Log Out'));
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        `http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/logout`,
        {},
        { withCredentials: true }
      );
    });
  });
});
