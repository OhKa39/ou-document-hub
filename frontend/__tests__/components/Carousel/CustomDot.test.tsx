import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import CustomDot from '@/components/Carousel/CustomDot';

describe('CustomDot Component', () => {
  it('renders correctly', () => {
    const onClick = jest.fn();
    render(<CustomDot onClick={onClick} active={true} />);

    const dot = screen.getByTestId('Dot');
    expect(dot).toBeInTheDocument();
  });

  it('calls onClick when dot is clicked', () => {
    const onClick = jest.fn();
    render(<CustomDot onClick={onClick} active={false} />);

    const dot = screen.getByTestId('Dot');
    fireEvent.click(dot);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
