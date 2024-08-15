import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DocumentItem from '@/components/DocumentItem';
import Book1 from '@/public/Book1.webp';

describe('Document Item component', () => {
  beforeEach(() => {
    const mockData = {
      id: 4,
      name: 'Giáo trình pháp luật đại cương',
      price: 299000,
      image: Book1,
      tag: 'New',
    };
    render(<DocumentItem {...mockData} />);
  });

  it('Should render tag correctly', () => {
    const tag = screen.getByTestId('Tag');

    expect(tag).toBeInTheDocument();
    const expected = ['Hot', 'New'];
    expect(expected).toContain(tag.textContent);
  });

  it('Should render all button correctly', () => {
    const loveButton = screen.getByTestId('Love');
    const addToCartButton = screen.getByTestId('AddToCart');

    expect(loveButton).toBeInTheDocument();
    expect(addToCartButton).toBeInTheDocument();
  });

  it('Should render document image correctly', () => {
    const documentImage = screen.getByTestId('DocumentImage');

    expect(documentImage).toBeInTheDocument();
  });

  it('Should render document name and price correctly', () => {
    const documentName = screen.getByTestId('DocumentName');
    const documentPrice = screen.getByTestId('DocumentPrice');

    const DOCUMENT_NAME_EXPECT = 'giáo trình pháp luật đại cương';
    const DOCUMENT_PRICE_EXPECT = '299,000đ';

    expect(documentName).toBeInTheDocument();
    expect(documentName.textContent?.toLowerCase()).toEqual(DOCUMENT_NAME_EXPECT);

    expect(documentPrice).toBeInTheDocument();
    expect(documentPrice.textContent).toEqual(DOCUMENT_PRICE_EXPECT);
  });
});
