import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Container from '@/components/Homepage/Container';

jest.mock('@/components/DocumentItem', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="DocumentItem"></div>;
    },
  };
});

describe('Container component', () => {
  beforeEach(() => {
    render(<Container />);
  });

  it('Should render contaienr with correct items number', () => {
    const ITEM_QUANTITY = 8;
    const items = screen.getAllByTestId('DocumentItem');

    expect(items.length).toEqual(ITEM_QUANTITY);
  });
});
