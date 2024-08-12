import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Navbar from '@/components/Navbar/Navbar'

describe('Responsive Menu component', () => {
  it('Should render menu correct', () => {
    render(<Navbar/>);
    const menu = screen.getByTestId('MenuResponsive')
    const menuClose = screen.getByTestId('MenuClose')
    expect(menu).toBeInTheDocument()
    expect(menuClose).toBeInTheDocument()
  })

  it('Should render menu item correct', () => {
    render(<Navbar/>)
    const menu = screen.getAllByTestId('MenuResponsiveItem')
    const expected = ["Kho tài liệu", "Kênh người bán", "Tìm kiếm", "Thông tin cá nhân", "Tin nhắn", "Hòm thư phản hồi", "Thống kê"]
    expect(menu.map(ele => ele.textContent)).toEqual(expected)
    for(let item of menu){
      expect(item).toBeInTheDocument()
    }
  })
})
