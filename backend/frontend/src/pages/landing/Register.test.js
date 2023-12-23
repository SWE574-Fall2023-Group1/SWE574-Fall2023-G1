import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Register from './Register';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('Register component', () => {
  test('renders without crashing', () => {
    render(<MemoryRouter>
        <Register />
      </MemoryRouter>)
  });

  test('handles form submission correctly', async () => {

    axios.post.mockResolvedValue({ data: { message: 'Registration successful' } });

    const { getByLabelText, getByText } = render(<MemoryRouter>
        <Register />
      </MemoryRouter>)

    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('E-Mail'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText('Password Again'), { target: { value: 'password123' } });


    fireEvent.click(getByText('Create Account'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    expect(getByText('Login')).toBeInTheDocument();
  });

  test('handles password mismatch correctly', () => {
    const { getByLabelText, getByText } = render(<MemoryRouter>
        <Register />
      </MemoryRouter>)


    fireEvent.change(getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(getByLabelText('E-Mail'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(getByLabelText('Password Again'), { target: { value: 'password456' } });


    fireEvent.click(getByText('Create Account'));


    expect(getByText("Create Account")).toBeInTheDocument();
  });
});
