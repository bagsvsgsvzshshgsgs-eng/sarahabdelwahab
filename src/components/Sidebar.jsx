import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export const Sidebar = ({ role, isOpen, onClose }) => {
  const location = useLocation()
  
  const adminLinks = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/students', icon: '👥', label: 'Students' },
    { to: '/admin/homework', icon: '📚', label: 'Exams' },
    { to: '/admin/results', icon: '✅', label: 'Results' },
    { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ]

  const studentLinks = [
    { to: '/student/home', icon: '🏠', label: 'Dashboard' },
    { to: '/student/settings', icon: '⚙️', label: 'Settings' },
  ]

  const links = role === 'admin' ? adminLinks : studentLinks

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} 
        onClick={onClose}
      ></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span>Sarah Abdelwahab</span>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="mobile-only btn-close-menu"
            onClick={onClose}
            aria-label="Close Menu"
          >
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div style={{ marginBottom: '12px', paddingLeft: '12px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {role === 'admin' ? 'Management' : 'Learning'}
          </div>
          
          {links.map(link => (
            <NavLink 
              key={link.to}
              to={link.to} 
              end={link.to.endsWith('dashboard') || link.to.endsWith('home')}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Developer Credit</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '2px' }}>Omar Ghazi</p>
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '12px' }}>Full Stack Developer</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <a 
                href="https://wa.me/201015367818" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.75rem', padding: '8px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                <span>💬</span> WhatsApp
              </a>
              <a 
                href="tel:01011600277" 
                style={{ width: '100%', background: 'white', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.75rem', padding: '8px', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span>📞</span> 01011600277
              </a>
            </div>
          </div>
        </div>

        <style>{`
          .sidebar {
            width: var(--sidebar-w);
            background: var(--bg-card);
            border-right: 1px solid var(--border-light);
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0; bottom: 0; left: 0;
            z-index: 40;
            transition: var(--transition);
          }

          .sidebar-header {
            height: var(--topbar-h);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-bottom: 1px solid var(--border-light);
          }

          .btn-close-menu {
            background: none;
            border: none;
            font-size: 1.25rem;
            color: var(--text-muted);
            cursor: pointer;
            padding: 4px;
          }

          .sidebar-brand {
            font-size: 1rem;
            font-weight: 800;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 10px;
            letter-spacing: -0.02em;
          }

          .sidebar-nav {
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
            overflow-y: auto;
          }

          .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 16px;
            border-radius: var(--radius-md);
            color: var(--text-muted);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: var(--transition);
          }

          .nav-item:hover {
            background: var(--bg-hover);
            color: var(--text-main);
          }

          .nav-item.active {
            background: var(--accent-light);
            color: var(--accent);
          }

          .nav-icon {
            font-size: 1.1rem;
          }
        `}</style>
      </aside>
    </>
  )
}
