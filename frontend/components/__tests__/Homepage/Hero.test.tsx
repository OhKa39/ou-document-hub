import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Homepage/Hero'

describe('Hero component', () => {
  it('Should render title correctly', () => {
    render(<Hero/>);
    const titleText = screen.getByTestId('Title')
    expect(titleText).toBeInTheDocument()
  })

  it('Should render description correctly', () => {
    render(<Hero/>)
    const paragraphText = screen.getByTestId('BookDescription')
    expect(paragraphText).toBeInTheDocument()
  })

  it('Should render author correctly', () => {
      render(<Hero/>)
      const byText = screen.getByTestId('ByText')
      expect(byText).toBeInTheDocument()
  })

  it('Should render order button correctly', () => {
      render(<Hero/>)
      const orderButton = screen.getByTestId('OrderButton')
      expect(orderButton).toBeInTheDocument()
  })

  it('Should render books correctly', () => {
      render(<Hero/>)
      const books = screen.getAllByTestId('Books')
      const BOOK_LENGTH = 3
      expect(books.length).toEqual(BOOK_LENGTH)
      for(let book in books){
        expect(books[book]).toBeInTheDocument()
      }
  })
})
