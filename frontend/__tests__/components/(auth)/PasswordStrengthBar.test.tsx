import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PasswordStrengthBar from '@/components/(auth)/sign-up/PasswordStrengthBar';

describe('PasswordStrengthBar component', () => {
  it('Should render total strength level with correct number(Default)', () => {
    render(<PasswordStrengthBar password="" />);

    const items = screen.getAllByTestId('StrengthLevel');

    expect(items.length).toEqual(5);
  });

  describe('Check password evaluation(Default)', () => {
    it('With < 8 characters', () => {
      render(<PasswordStrengthBar password="" />);

      const EXPECT_COLOR = '#ef4836';
      const EXPECT_DEFAULT_COLOR = '#ddd';
      const EXPECT_LEVEL = 1;
      const items = screen.getAllByTestId('StrengthLevel');

      for (let index = 0; index < items.length; ++index) {
        if (index < EXPECT_LEVEL) expect(items[index]).toHaveStyle(`background-color: ${EXPECT_COLOR}`);
        else expect(items[index]).toHaveStyle(`background-color: ${EXPECT_DEFAULT_COLOR}`);
      }
    });

    it('With == 8 characters, all lower case character', () => {
      render(<PasswordStrengthBar password="afewrewq" />);

      const EXPECT_COLOR = '#ef4836';
      const EXPECT_DEFAULT_COLOR = '#ddd';
      const EXPECT_LEVEL: number = 2;
      const items = screen.getAllByTestId('StrengthLevel');

      for (let index = 0; index < items.length; ++index) {
        if (index < EXPECT_LEVEL) expect(items[index]).toHaveStyle(`background-color: ${EXPECT_COLOR}`);
        else expect(items[index]).toHaveStyle(`background-color: ${EXPECT_DEFAULT_COLOR}`);
      }
    });

    it('With == 8 characters, contain number, lowercase char ', () => {
      render(<PasswordStrengthBar password="afewre1q" />);

      const EXPECT_COLOR = '#f6b44d';
      const EXPECT_DEFAULT_COLOR = '#ddd';
      const EXPECT_LEVEL = 3;
      const items = screen.getAllByTestId('StrengthLevel');

      for (let index = 0; index < items.length; ++index) {
        if (index < EXPECT_LEVEL) expect(items[index]).toHaveStyle(`background-color: ${EXPECT_COLOR}`);
        else expect(items[index]).toHaveStyle(`background-color: ${EXPECT_DEFAULT_COLOR}`);
      }
    });

    it('With == 8 characters, contain number, lowercase, special char ', () => {
      render(<PasswordStrengthBar password="afewr$1q" />);

      const EXPECT_COLOR = '#2b90ef';
      const EXPECT_DEFAULT_COLOR = '#ddd';
      const EXPECT_LEVEL = 4;
      const items = screen.getAllByTestId('StrengthLevel');

      for (let index = 0; index < items.length; ++index) {
        if (index < EXPECT_LEVEL) expect(items[index]).toHaveStyle(`background-color: ${EXPECT_COLOR}`);
        else expect(items[index]).toHaveStyle(`background-color: ${EXPECT_DEFAULT_COLOR}`);
      }
    });

    it('With == 8 characters, contain number, lowercase, special, uppercase char ', () => {
      render(<PasswordStrengthBar password="afeAr$1q" />);

      const EXPECT_COLOR = '#25c281';
      const EXPECT_DEFAULT_COLOR = '#ddd';
      const EXPECT_LEVEL = 5;
      const items = screen.getAllByTestId('StrengthLevel');

      for (let index = 0; index < items.length; ++index) {
        if (index < EXPECT_LEVEL) expect(items[index]).toHaveStyle(`background-color: ${EXPECT_COLOR}`);
        else expect(items[index]).toHaveStyle(`background-color: ${EXPECT_DEFAULT_COLOR}`);
      }
    });

    it('With < 8 characters, contain number, lowercase, special, uppercase char ', () => {
      render(<PasswordStrengthBar password="Ar$1" />);

      const EXPECT_COLOR = '#ef4836';
      const EXPECT_DEFAULT_COLOR = '#ddd';
      const EXPECT_LEVEL = 1;
      const items = screen.getAllByTestId('StrengthLevel');

      for (let index = 0; index < items.length; ++index) {
        if (index < EXPECT_LEVEL) expect(items[index]).toHaveStyle(`background-color: ${EXPECT_COLOR}`);
        else expect(items[index]).toHaveStyle(`background-color: ${EXPECT_DEFAULT_COLOR}`);
      }
    });
  });
});
