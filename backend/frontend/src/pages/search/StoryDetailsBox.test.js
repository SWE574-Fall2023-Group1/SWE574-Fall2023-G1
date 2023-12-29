import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import StoryDetailsBox from './StoryDetailsBox';

describe('StoryDetailsBox', () => {
  const mockStory = {
    title: 'Test Story',
    author_username: 'testuser',
    date: new Date().toISOString(),
    date_type: 'normal_date',
  };

  it('renders without crashing', () => {
    render(<StoryDetailsBox story={mockStory} />);
    expect(screen.getByText(mockStory.title)).toBeInTheDocument();
    expect(screen.getByText(/by testuser/)).toBeInTheDocument();
  });

  it('handles hover state', () => {
    const { container } = render(<StoryDetailsBox story={mockStory} />);
    const div = container.firstChild;
    fireEvent.mouseEnter(div);
    expect(div).toHaveClass('hovered');
    fireEvent.mouseLeave(div);
    expect(div).not.toHaveClass('hovered');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<StoryDetailsBox story={mockStory} onClick={handleClick} />);
    fireEvent.click(screen.getByText(mockStory.title));
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders an image when imageUrl is provided', () => {
    const imageUrl = 'http://example.com/image.jpg';
    render(<StoryDetailsBox story={mockStory} imageUrl={imageUrl} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', imageUrl);
    expect(image).toHaveAttribute('alt', `Story titled ${mockStory.title}`);
  });

  // Additional tests for formatDate function with different date_types
  // ...
});
