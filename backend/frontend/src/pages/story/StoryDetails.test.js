import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import StoryDetails from './StoryDetails';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('StoryDetails Component', () => {
  const mockNavigate = jest.fn();
  const mockUseParams = { id: '123' };

  beforeEach(() => {
    useParams.mockReturnValue(mockUseParams);
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders and fetches story details on mount', async () => {
    axios.get.mockResolvedValue({});
    render(<StoryDetails currentTheme='default' />);
    expect(axios.get).toHaveBeenCalled();
  });

  it('handles API error gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    render(<StoryDetails currentTheme='default' />);
  });
});
