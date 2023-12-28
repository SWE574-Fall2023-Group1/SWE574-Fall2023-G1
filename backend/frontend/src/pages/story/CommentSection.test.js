import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CommentSection from './CommentSection';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  useNavigate: () => jest.fn(),
}));

describe('CommentSection', () => {
  const mockComments = [
    { id: '1', comment_author: 'User1', text: 'Comment 1', date: new Date().toISOString(), comment_author_id: 'a1' },
    { id: '2', comment_author: 'User2', text: 'Comment 2', date: new Date().toISOString(), comment_author_id: 'a2' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { comments: mockComments, has_next: false, has_prev: false, total_pages: 1 } });
  });

  test('should render comments on initial load', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        comments: mockComments,
        has_next: false,
        has_prev: false,
        total_pages: 1
      }
    });

    const { rerender } = render(<CommentSection comments={[]} setComments={() => {}} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    rerender(<CommentSection comments={mockComments} setComments={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('Comment 1')).toBeInTheDocument();
      expect(screen.getByText('Comment 2')).toBeInTheDocument();
    });
  });

  test('should handle pagination correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        comments: mockComments,
        has_next: true,
        has_prev: false,
        total_pages: 2
      }
    });

    const { rerender } = render(<CommentSection comments={mockComments} setComments={() => {}} />);

    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
    });

    axios.get.mockResolvedValueOnce({
      data: {
        comments: [],
        has_next: false,
        has_prev: true,
        total_pages: 2
      }
    });

    rerender(<CommentSection comments={[]} setComments={() => {}} />);

    await waitFor(() => {

      expect(screen.queryByText('Comment 1')).not.toBeInTheDocument();
    });
  });


  test('should submit new comment', async () => {
    const mockPost = jest.spyOn(axios, 'post').mockResolvedValue({});
    render(<CommentSection comments={mockComments} setComments={() => {}} />);

    fireEvent.change(screen.getByLabelText('Add a comment'), { target: { value: 'New comment' } });
    fireEvent.click(screen.getByText('Comment'));

    await waitFor(() => expect(mockPost).toHaveBeenCalled());
    expect(mockPost).toHaveBeenCalledWith(expect.any(String), { text: 'New comment' }, { withCredentials: true });
  });
});
