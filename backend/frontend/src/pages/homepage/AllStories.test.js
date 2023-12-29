import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import AllStories from './AllStories';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('AllStories component', () => {
  test('renders loading state initially', () => {
    const { getByText } = render(<MemoryRouter>
        <AllStories />
      </MemoryRouter>)
    expect(getByText('Loading...')).toBeInTheDocument();
  });
});
