import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Navbar from '@/components/Navbar/Navbar'

describe('NavBar component', () => {
  it('Should render a heading with correct string', () => {
    render(<Navbar/>);
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBe("OUDocumentHub")
  })

  it('Should render menu items with correct element', () => {
    render(<Navbar/>);
 
    const menuItems = screen.getAllByTestId('MenuItemDesktop').map(ele => ele.textContent)

    const expected = ["Trang chủ", "Kho Tài liệu", "Kênh người bán"]
    expect(menuItems).toEqual(expected)
  })
  
  it('Should render button items with correct element', () => {
    render(<Navbar/>);
 
    const search = screen.getByTestId('Search')
    const notification = screen.getByTestId('Notification')
    const user = screen.getByTestId('User')
    const cart = screen.getByTestId('Cart')


    expect(search).toBeInTheDocument()
    expect(notification).toBeInTheDocument()
    expect(user).toBeInTheDocument()
    expect(cart).toBeInTheDocument()
  })
})
