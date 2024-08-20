import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ThirdAppsButton from '@/components/(auth)/ThirdAppsButton';
import { SocialIcon } from 'react-social-icons';

jest.mock('react-social-icons');

describe('ThirdAppsButton component', () => {
  beforeEach(() => {
    render(<ThirdAppsButton />);
  });

  it('Should render social button with correct items number', () => {
    const ITEM_QUANTITY = 2;
    // console.log(screen.getAllByTestId('SocialItem'));
    const items = screen.getAllByTestId('SocialItem');

    expect(items.length).toEqual(ITEM_QUANTITY);
  });

  it('renders social icons', () => {
    render(<ThirdAppsButton />);
    expect(SocialIcon).toHaveBeenCalledWith(expect.objectContaining({ network: 'facebook' }), expect.anything());
    expect(SocialIcon).toHaveBeenCalledWith(expect.objectContaining({ network: 'google' }), expect.anything());
  });
});
