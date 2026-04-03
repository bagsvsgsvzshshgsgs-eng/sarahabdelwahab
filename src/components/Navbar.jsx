import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  // Map paths to titles
  const getTitle = () => {
    const path = location.pathname
    if (path.includes('/dashboard')) return 'Overview'
    if (path.includes('/students')) return 'Students'
    if (path.includes('/homework')) return 'Exams'
    if (path.includes('/results')) return 'Results'
    if (path.includes('/settings')) return 'Settings'
    if (path.includes('/student/home')) return 'Home'
    return 'Sarah Abdelwahab'
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger Menu Button */}
        <button 
          className="mobile-only btn-menu" 
          onClick={onMenuToggle}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
        <h2 className="page-title">{getTitle()}</h2>
      </div>
      
      {user && (
        <div className="topbar-right">
          <div className="user-profile desktop-only">
            <div className="avatar">
              <div className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', marginLeft: '8px' }}>
            Logout
          </button>
        </div>
      )}

      <style>{`
        .topbar {
          height: var(--topbar-h);
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-menu {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .page-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 2px;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: capitalize;
        }

        @media (max-width: 1024px) {
          .topbar {
            padding: 0 16px;
          }
        }
      `}</style>
    </header>
  )
}
