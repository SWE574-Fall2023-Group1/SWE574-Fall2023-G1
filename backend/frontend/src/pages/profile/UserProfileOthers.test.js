import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import UserProfileOthers from './UserProfileOthers';

jest.mock('axios');

// ... (imports and setup)

describe('UserProfileOthers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('renders loading when user is null', async () => {
      render(
        <MemoryRouter>
          <UserProfileOthers currentTheme="light" />
        </MemoryRouter>
      );
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
});
