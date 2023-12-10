import { render, screen } from '@testing-library/react';
import App from './App';

test('renders register link', () => {
  render(<App />);
  const linkElement = screen.getByText(/register/i);
  expect(linkElement).toBeInTheDocument();
});
