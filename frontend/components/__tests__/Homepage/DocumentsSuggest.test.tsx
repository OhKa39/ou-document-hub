import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DocumentsSuggest from '@/components/Homepage/DocumentsSuggest';

describe('Documents Suggest component', () => {
  beforeEach(() => {
    render(<DocumentsSuggest />);
  });

  it('Should render title correctly', () => {
    const titleText = screen.getByTestId('Title');

    expect(titleText).toBeInTheDocument();
    expect(titleText.textContent).toEqual('Tài Liệu Gợi Ý');
  });
});
