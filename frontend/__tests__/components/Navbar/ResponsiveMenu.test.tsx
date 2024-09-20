import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import ResponsiveMenu from '@/components/Navbar/ResponsiveMenu'

describe('Responsive Menu component', () => {
  beforeEach (()=>{
    const handleClick = jest.fn()
    render(<ResponsiveMenu/>)
    const menu = screen.getByTestId('MenuOpen')
    menu.onclick = handleClick
    fireEvent.click(menu)
  })

  it('Should close menu correctly', () => {
    // render(<ResponsiveMenu/>);
    const handleClickClose = jest.fn()
    const menuClose = screen.getByTestId('MenuClose')
    menuClose.onclick = handleClickClose
    
    fireEvent.click(menuClose)

    expect(handleClickClose).toHaveBeenCalledTimes(1)
  })

  it('Should render menu item correctly', () => {
    // render(<ResponsiveMenu/>)

    const menu = screen.getAllByTestId('MenuResponsiveItem')
    const expected = ["Kho Tài Liệu", "Kênh Người Bán", "Tìm Kiếm", "Thông Tin Cá Nhân", "Thống Kê"]

    expect(menu.map(ele => ele.textContent)).toEqual(expected)
    for(let item of menu){
      expect(item).toBeInTheDocument()
    }
  })

  it('Should render submenu item correctly', () => {
    // render(<ResponsiveMenu/>)

    const menu = screen.getAllByTestId('SubmenuItem')
    const expected = ["Hòm thư phản hồi", "Tin nhắn", "Tài liệu yêu thích"]

    expect(menu.map(ele => ele.textContent)).toEqual(expected)
    for(let item of menu){
      expect(item).toBeInTheDocument()
    }
  })

  it('Should render login button correctly', () => {
    // render(<ResponsiveMenu/>)

    const loginButton = screen.getByTestId('LoginButton')
    
    expect(loginButton).toBeInTheDocument()
  })
})
