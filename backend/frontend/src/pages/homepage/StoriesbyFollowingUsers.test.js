import React from 'react';
import { render, screen, waitFor, fireEvent  } from '@testing-library/react';
import axios from 'axios';
import StoriesByFollowingsUsers from './StoriesbyFollowingUsers.js';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('StoriesByFollowingsUsers', () => {
  it('renders stories correctly', async () => {
    axios.get.mockResolvedValue({
      data: {
        stories: [
          {
            id: 1,
            author: 'user123',
            title: 'Test Story',
            creation_date: new Date().toISOString(),
            location_ids: [{ name: 'Test Location' }],
          },
        ],
        has_next: false,
        has_prev: false,
        total_pages: 1,
      },
    });
    render(<MemoryRouter>
        <StoriesByFollowingsUsers />
      </MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Test Story')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
    });
  });

  it('handles page change correctly', async () => {
    axios.get.mockResolvedValue({
      data: {
        stories: [],
        has_next: true,
        has_prev: false,
        total_pages: 2,
      },
    });

    render(<MemoryRouter>
        <StoriesByFollowingsUsers />
      </MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    expect(screen.getByText('Previous')).not.toBeEnabled();
  });
});
