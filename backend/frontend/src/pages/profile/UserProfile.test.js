import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import UserProfile from './UserProfile';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('UserProfile', () => {
  it('renders loading when user is not loaded', () => {
    render(<MemoryRouter>
        <UserProfile />
      </MemoryRouter>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
