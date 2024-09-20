import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DocumentMultiCarousel from '@/components/Homepage/DocumentMultiCarousel';

// Mock the Carousel component
jest.mock('react-multi-carousel');

describe('Document Multi Carousel component', () => {
  beforeEach(() => {
    render(<DocumentMultiCarousel />);
  });

  it('Should render title correctly', () => {
    const titleText = screen.getByTestId('Title');

    expect(titleText).toBeInTheDocument();
    expect(titleText.textContent).toEqual('Tài Liệu Mới');
  });

  it('Should render document item correct number', () => {
    const documentItems = screen.getAllByTestId('DocumentItem');

    const NUMBER_ITEM_EXPECT = 8;

    // Check if the carousel container is rendered
    expect(screen.getByTestId('carousel')).toBeInTheDocument();

    // Check if the correct number of items are rendered
    const items = screen.getAllByTestId('DocumentItem');
    expect(items).toHaveLength(NUMBER_ITEM_EXPECT); // Assuming you have 5 items
  });
});
