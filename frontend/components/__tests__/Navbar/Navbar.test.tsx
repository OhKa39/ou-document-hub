import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import Navbar from '@/components/Navbar/Navbar'
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', ()=> ({useRouter: jest.fn()}));

const pushMock = jest.fn();

(useRouter as jest.Mock).mockReturnValue({
  push: pushMock
})

describe('NavBar component', () => {
  beforeEach(()=>{
    render(<Navbar/>)
  })

  it('Should render a heading with correct string', () => {
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBe("OUDocumentHub")
  })

  it('Should render menu items with correct element', () => {
    const menuItems = screen.getAllByTestId('MenuItemDesktop')
    const expected = ["Trang Chủ", "Kho Tài Liệu", "Kênh Người Bán"]

    expect(menuItems.map(ele => ele.textContent)).toEqual(expected)
    for(let menuItem of menuItems){
      expect(menuItem).toBeInTheDocument()
    }
  })
  
  it('Should render button items with correct element', () => {
    const search = screen.getByTestId('Search')
    const notification = screen.getByTestId('Notification')
    const user = screen.getByTestId('User')
    const cart = screen.getByTestId('Cart')

    expect(search).toBeInTheDocument()
    expect(notification).toBeInTheDocument()
    expect(user).toBeInTheDocument()
    expect(cart).toBeInTheDocument()
  })
  it('Should trigger user button when click', () => {
    const user = screen.getByTestId('User')

    const onClick = jest.fn()
    user.onclick = onClick
    fireEvent.click(user)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledTimes(1)
    
  })
})
