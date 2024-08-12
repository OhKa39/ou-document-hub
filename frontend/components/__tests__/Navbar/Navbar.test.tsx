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
 
    const menuItems = screen.getAllByTestId('MenuItemDesktop')
    const expected = ["Trang Chủ", "Kho Tài Liệu", "Kênh Người Bán"]

    expect(menuItems.map(ele => ele.textContent)).toEqual(expected)
    for(let menuItem of menuItems){
      expect(menuItem).toBeInTheDocument()
    }
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
