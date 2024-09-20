import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer component', () => {
  it('Should render title correctly', () => {
    render(<Footer />);

    const heading = screen.getByTestId('Title');

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('OUDocumentHub');
  });

  it('Should render VietnameseTitle correctly', () => {
    render(<Footer />);

    const heading = screen.getByTestId('VietnameseTitle');

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Hệ thống quản lý tài liệu OU');
  });

  it('Should render navigation items with correct element', () => {
    render(<Footer />);

    const navigationItems = screen.getAllByTestId('NavigationItem');
    const expected = ['Trang chủ', 'Kho tài liệu', 'Kênh người bán', 'About website'];

    expect(navigationItems.map((ele) => ele.textContent)).toEqual(expected);
    for (let item of navigationItems) {
      expect(item).toBeInTheDocument();
    }
  });

  it('Should render button items with correct element', () => {
    render(<Footer />);

    const instagram = screen.getByTestId('Instagram');
    const facebook = screen.getByTestId('Facebook');
    const github = screen.getByTestId('Github');

    expect(instagram).toBeInTheDocument();
    expect(facebook).toBeInTheDocument();
    expect(github).toBeInTheDocument();
  });

  it('Should render copyright correctly', () => {
    render(<Footer />);

    const copyright = screen.getByText('Copyright © 2024 Ohka39. All rights reserved.');

    expect(copyright).toBeInTheDocument();
  });
});
