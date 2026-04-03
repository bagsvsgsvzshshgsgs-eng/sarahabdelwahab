import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, deleteUser } from '../../utils/storage'

export const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = () => {
    setStudents(getStudents())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteUser(id)
      loadData()
    }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Student Roster</h1>
          <p>You have {students.length} active students enrolled in your courses.</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
             <input 
               type="text" 
               className="form-input search-input" 
               placeholder="Search name or ID..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/students/new" className="btn btn-primary">
            <span>➕</span> Add Student
          </Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Student Identity</th>
              <th className="desktop-only">Credential</th>
              <th className="tablet-only">Status</th>
              <th className="desktop-only">Performance</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const filtered = students.filter(s => 
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                s.id.toLowerCase().includes(searchQuery.toLowerCase())
              )

              if (filtered.length === 0) {
                return (
                  <tr>
                    <td colSpan="5" style={{ padding: '80px 24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{searchQuery ? '🔎' : '👥'}</div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                        {searchQuery ? 'No Results Found' : 'No Students Yet'}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        {searchQuery ? `We couldn't find matches for "${searchQuery}"` : 'Start by adding your first student account.'}
                      </p>
                      {!searchQuery && <Link to="/admin/students/new" className="btn btn-primary">Create Account</Link>}
                      {searchQuery && <button onClick={() => setSearchQuery('')} className="btn btn-outline" style={{ margin: '0 auto' }}>Clear Search</button>}
                    </td>
                  </tr>
                )
              }

              return filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID #{s.id.substring(0, 4).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="desktop-only">
                    <code style={{ background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '700' }}>
                      @{s.username}
                    </code>
                  </td>
                  <td className="tablet-only">
                    <span className="badge badge-success">ACTIVE</span>
                  </td>
                  <td className="desktop-only">
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>N/A</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <Link to={`/admin/students/${s.id}/edit`} className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px' }}>
                        ✏️
                      </Link>
                      <button onClick={() => handleDelete(s.id)} className="btn btn-outline" style={{ padding: '8px', borderRadius: '8px', color: 'var(--danger)' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            })()}
          </tbody>
        </table>
      </div>

      <style>{`
        .header-actions {
          display: flex;
          gap: 12px;
        }

        .search-container { 
          position: relative; 
          flex: 1; 
          min-width: 240px; 
        }

        .search-input { 
          width: 100%; 
          padding-left: 40px; 
          font-size: 0.85rem; 
          height: 48px;
          border-radius: 12px;
        }

        .search-icon { 
          position: absolute; 
          left: 14px; 
          top: 50%; 
          transform: translateY(-50%); 
          opacity: 0.4; 
          font-size: 0.9rem;
        }

        @media (max-width: 1024px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }

          .header-actions {
            flex-direction: column;
            gap: 12px;
          }

          .search-container {
            width: 100% !important;
            min-width: 0;
          }

          .page-header .btn {
            width: 100%;
          }
        }

        /* Responsive Visibility Utilities */
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
        @media (max-width: 1024px) {
          .desktop-only-large { display: none !important; }
        }
      `}</style>
    </div>
  )
}
