import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchResults from './SearchResults';
import { useNavigate, useLocation } from 'react-router-dom';
import withAuth from '../../authCheck';


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('../../authCheck', () => (component) => component);

describe('SearchResults', () => {
  const mockNavigate = jest.fn();
  const mockStories = [
    { id: '1', title: 'Story Title 1', author_username: 'Author1', creation_date: '2020-01-01' },
  ];

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ state: { stories: mockStories } });
  });

  it('renders correctly', () => {
    const { getByText } = render(<SearchResults currentTheme="default" />);
    expect(getByText('Story Title 1')).toBeInTheDocument();
  });

  it('navigates to story detail on story click', () => {
    const { getByText } = render(<SearchResults currentTheme="default" />);
    const storyTitle = getByText('Story Title 1');
    fireEvent.click(storyTitle);
    expect(mockNavigate).toHaveBeenCalledWith(`/story/1`);
  });
});
