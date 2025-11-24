import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator', () => {
  render(<App />);
  const clearButton = screen.getByText(/clear/i);
  expect(clearButton).toBeInTheDocument();
});

test('renders calculator display', () => {
  render(<App />);
  const displays = screen.getAllByText('0');
  expect(displays.length).toBeGreaterThan(0);
});
