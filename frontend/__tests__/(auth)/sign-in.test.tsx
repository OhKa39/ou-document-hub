import SignIn from '@/app/(auth)/sign-in/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Sign In page', () => {
  it('Should render video section correctly', () => {
    render(<SignIn />);

    const item = screen.getByTestId('SignInVideoSection');

    expect(item).toBeInTheDocument();
  });
});
