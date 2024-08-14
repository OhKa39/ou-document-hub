import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DocumentItem from '@/components/DocumentItem'

describe('Document Item component', () => {
  beforeEach(()=>{
      render(<DocumentItem/>);
  })

  it('Should render tag correctly', () => {
    const tag = screen.getByTestId('Tag')
 
    expect(tag).toBeInTheDocument()
    const expected = ["Hot", "New"]
    expect(expected).toContain(tag.textContent)
  })

  it('Should render all button correctly', () => {
    const loveButton = screen.getByTestId('Love')
    const addToCartButton = screen.getByTestId('AddToCart')
 
    expect(loveButton).toBeInTheDocument()
    expect(addToCartButton).toBeInTheDocument()
  })

  it('Should render document image correctly', () => {
    const documentImage = screen.getByTestId('DocumentImage')
 
    expect(documentImage).toBeInTheDocument()
  })

  it('Should render document name and price correctly', () => {
    const documentName = screen.getByTestId('DocumentName')
    const documentPrice = screen.getByTestId('DocumentPrice')
 
    expect(documentName).toBeInTheDocument()
    expect(documentPrice).toBeInTheDocument()
  })
})