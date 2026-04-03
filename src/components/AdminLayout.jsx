import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const AdminLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu when route changes (on mobile)
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="app-layout">
      <Sidebar role="admin" isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="main-wrapper">
        <Navbar onMenuToggle={toggleMenu} />
        <main className="content-area animate-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
