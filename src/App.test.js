import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const AppWithHelmet = () => (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

test('renders FitConnect brand', () => {
  render(<AppWithHelmet />);
  const brandElement = screen.getByText(/FITCONNECT/i);
  expect(brandElement).toBeInTheDocument();
});

test('renders hero section', () => {
  render(<AppWithHelmet />);
  const heroElement = screen.getByText(/เชื่อมต่อคุณกับ/i);
  expect(heroElement).toBeInTheDocument();
});

test('renders search trainer button', () => {
  render(<AppWithHelmet />);
  const searchButton = screen.getByText(/ค้นหาเทรนเนอร์/i);
  expect(searchButton).toBeInTheDocument();
});