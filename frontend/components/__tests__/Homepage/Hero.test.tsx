import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Homepage/Hero'

describe('Hero component', () => {
  it('Should render title correct', () => {
    render(<Hero/>);
    const titleText = screen.getByTestId('Title')
    expect(titleText).toBeInTheDocument()
  })

  it('Should render description correct', () => {
    render(<Hero/>)
    const paragraphText = screen.getByTestId('BookDescription')
    const expected = "lorem will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    expect(paragraphText).toBeInTheDocument()
    expect(paragraphText.textContent?.toLowerCase()).toEqual(expected.toLowerCase())
  })

  it('Should render author correct', () => {
      render(<Hero/>)
      const byText = screen.getByTestId('ByText')
      const expected = "by Bùi ngọc tuyền"
      expect(byText).toBeInTheDocument()
      expect(byText.textContent?.toLowerCase()).toEqual(expected.toLowerCase())
  })

  it('Should render order button', () => {
      render(<Hero/>)
      const orderButton = screen.getByTestId('OrderButton')
      expect(orderButton).toBeInTheDocument()
  })

  it('Should render books', () => {
      render(<Hero/>)
      const books = screen.getAllByTestId('Books')
      const BOOK_LENGTH = 3
      expect(books.length).toEqual(BOOK_LENGTH)
      for(let book in books){
        expect(books[book]).toBeInTheDocument()
      }
  })
})
