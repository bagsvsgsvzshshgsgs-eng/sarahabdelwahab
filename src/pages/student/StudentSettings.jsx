import React, { useState } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { saveUser } from '../../utils/storage'

export const StudentSettings = () => {
  const { user, login } = useAppContext()
  const [formData, setFormData] = useState({ name: user?.name, password: user?.password })
  const [msg, setMsg] = useState({ text: '', type: '' })

  const handleUpdate = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.password) {
      setMsg({ text: 'All fields are required.', type: 'danger' })
      return
    }

    const updatedUser = { ...user, name: formData.name, password: formData.password }
    saveUser(updatedUser)
    login(updatedUser) // Update context
    setMsg({ text: 'Profile updated successfully!', type: 'success' })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  return (
    <div className="settings-container fade-in">
      <div className="page-header settings-header">
        <div className="page-header-text">
          <h1 className="settings-title">Student Profile</h1>
          <p className="settings-subtitle">Manage your personal presence and security credentials.</p>
        </div>
      </div>

      <div className="settings-content">
        
        <div className="card settings-card">
          <h3 className="section-title-mini">Account Details</h3>
          
          <div className="profile-hero">
            <div className="avatar settings-avatar" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-meta">
              <div className="profile-name">{user?.name}</div>
              <div className="profile-role">Student Identity</div>
            </div>
          </div>

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">System Username</label>
              <input type="text" className="form-input" value={user?.username} disabled />
              <p className="input-hint">Your unique identifier cannot be changed.</p>
            </div>

            <div className="form-group" style={{ marginTop: '32px' }}>
              <h3 className="section-title-mini" style={{ marginBottom: '16px' }}>Change Access Password</h3>
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set a new secure password"
              />
            </div>

            {msg.text && (
              <div className={`badge badge-${msg.type}`} style={{ display: 'block', width: '100%', padding: '12px', textAlign: 'center', marginBottom: '24px' }}>
                {msg.text}
              </div>
            )}

            <button type="submit" className="btn btn-primary settings-btn">
              Save Profile Changes
            </button>
          </form>
        </div>

        <div className="card settings-card" style={{ border: '1px solid var(--border-light)', background: '#f8fafc' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Learning Data Info</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Your assessment history and performance metrics are securely stored. To reset your progress, please contact the administrator (Sarah Abdelwahab).
          </p>
        </div>

      </div>

      <style>{`
        .settings-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .settings-header { text-align: left; }
        .settings-title { font-size: 2rem; font-weight: 800; color: var(--primary); }
        .settings-subtitle { font-size: 0.95rem; color: var(--text-muted); }

        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card { padding: 32px; background: white; border: 1px solid var(--border-light); }
        .section-title-mini { font-size: 1rem; font-weight: 800; color: var(--primary); margin-bottom: 24px; }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }

        .settings-avatar { width: 72px; height: 72px; font-size: 1.75rem; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .profile-name { font-size: 1.25rem; font-weight: 800; color: var(--primary); }
        .profile-role { font-size: 0.85rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

        .input-hint { font-size: 0.7rem; color: var(--text-muted); margin-top: 6px; }
        .settings-btn { height: 52px; width: 100%; font-weight: 800; border-radius: 12px; }

        @media (max-width: 768px) {
          .settings-header { text-align: center; }
          .profile-hero { flex-direction: column; text-align: center; }
          .settings-card { padding: 24px; }
        }
      `}</style>
    </div>
  )
}
