import React from 'react'
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar'
const Nav = () => {
  return (
     <Navbar>
      <NavbarSection>
        <NavbarItem href="/">Home</NavbarItem>
        <NavbarItem href="/events">Events</NavbarItem>
        <NavbarItem href="/orders">Orders</NavbarItem>
      </NavbarSection>
    </Navbar>
  )
}

export default Nav