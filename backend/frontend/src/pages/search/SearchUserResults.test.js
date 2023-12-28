import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import SearchUserResults from './SearchUserResults';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

describe('SearchUserResults', () => {
  const mockUsers = [
    { id: '1', username: 'User1' },
    { id: '2', username: 'User2' },
  ];

  it('displays loading text', () => {
    useParams.mockReturnValue({ searchQuery: 'test' });
    axios.get.mockResolvedValue({ data: { users: [] } });

    const { getByText } = render(<SearchUserResults currentTheme="light" />);
    expect(getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('displays users after loading', async () => {
    useParams.mockReturnValue({ searchQuery: 'test' });
    axios.get.mockResolvedValue({ data: { users: mockUsers } });

    const { getByText } = render(<SearchUserResults currentTheme="light" />);

    await waitFor(() => {
      expect(getByText('User1')).toBeInTheDocument();
      expect(getByText('User2')).toBeInTheDocument();
    });
  });

  it('navigates to user profile on click', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ searchQuery: 'test' });
    axios.get.mockResolvedValue({ data: { users: mockUsers } });

    const { getByText, findByText } = render(<SearchUserResults currentTheme="light" />);
    const firstUser = await findByText('User1');
    fireEvent.click(firstUser);

    expect(mockNavigate).toHaveBeenCalledWith('/user-profile/1');
  });
});
