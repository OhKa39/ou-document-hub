import SignUp from '@/app/(auth)/sign-up/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Sign Up page', () => {
  it('Should render video section correctly', () => {
    render(<SignUp />);

    const item = screen.getByTestId('SignUpVideoSection');

    expect(item).toBeInTheDocument();
  });
});
