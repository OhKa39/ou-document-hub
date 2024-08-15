import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DocumentGroup from '@/components/Homepage/DocumentGroup';

describe('Document Group component', () => {
  beforeEach(() => {
    render(<DocumentGroup />);
  });

  it('Should render title correctly', () => {
    const titleText = screen.getByTestId('Title');

    expect(titleText).toBeInTheDocument();
    expect(titleText.textContent).toEqual('Tài Liệu Theo Ngành');
  });

  it('Should render document group item with correct quantity', () => {
    const documentGroupItems = screen.getAllByTestId('DocumentGroupItem');

    const ITEM_QUANTITY = 3;

    expect(documentGroupItems.length).toEqual(ITEM_QUANTITY);
  });
});
