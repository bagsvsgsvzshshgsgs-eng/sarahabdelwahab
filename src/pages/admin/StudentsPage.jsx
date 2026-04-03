import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, deleteUser } from '../../utils/storage'

export const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = async () => {
    setLoading(true)
    const data = await getStudents()
    // Sort by name
    data.sort((a, b) => a.name.localeCompare(b.name))
    setStudents(data)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the platform? Their Firebase account will remain but their profile will be deleted.`)) return
    setLoading(true)
    await deleteUser(id)
    await loadData()
  }

  const formatLastLogin = (ts) => {
    if (!ts) return 'Never'
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString()
  }

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Student Roster</h1>
          <p>
            {students.length} active student{students.length !== 1 ? 's' : ''} enrolled.
            {' '}All accounts stored securely in Firebase.
          </p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/students/new" className="btn btn-primary">
            <span>➕</span> Add Student
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Loading students...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Student</th>
                <th className="desktop-only">Username</th>
                <th className="tablet-only">Grade</th>
                <th className="desktop-only">Last Login</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                      {searchQuery ? '🔎' : '👥'}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                      {searchQuery ? 'No Results Found' : 'No Students Yet'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                      {searchQuery
                        ? `No matches for "${searchQuery}"`
                        : 'Start by adding your first student account.'}
                    </p>
                    {!searchQuery && (
                      <Link to="/admin/students/new" className="btn btn-primary">Create Account</Link>
                    )}
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="btn btn-outline" style={{ margin: '0 auto' }}>
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="avatar" style={{
                          width: '42px', height: '42px', borderRadius: '12px',
                          background: 'var(--accent-light)', color: 'var(--accent)',
                          fontWeight: '800', fontSize: '0.9rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {s.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.name}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {s.grade || 'No grade'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="desktop-only">
                      <code style={{ background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '700' }}>
                        @{s.username}
                      </code>
                    </td>

                    <td className="tablet-only">
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        {s.grade || 'N/A'}
                      </span>
                    </td>

                    <td className="desktop-only">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: s.lastLogin ? 'var(--success)' : '#cbd5e1',
                          flexShrink: 0,
                        }}></span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          {formatLastLogin(s.lastLogin)}
                        </span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link
                          to={`/admin/students/${s.id}/edit`}
                          className="btn btn-outline"
                          style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', height: '36px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          ✏️ <span className="desktop-only">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="btn btn-outline"
                          style={{ padding: '8px 12px', borderRadius: '8px', color: 'var(--danger)', height: '36px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
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
          .page-header { flex-direction: column; align-items: stretch; gap: 20px; }
          .header-actions { flex-direction: column; gap: 12px; }
          .search-container { width: 100% !important; min-width: 0; }
          .page-header .btn { width: 100%; }
        }

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
