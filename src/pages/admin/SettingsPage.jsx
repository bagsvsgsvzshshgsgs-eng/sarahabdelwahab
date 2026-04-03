import React from 'react'
import { useAppContext } from '../../contexts/AppContext'

export const SettingsPage = () => {
  const { user } = useAppContext()

  return (
    <div className="settings-container">
      <div className="page-header settings-header">
        <div className="page-header-text">
          <h1 className="settings-title">Platform Settings</h1>
          <p className="settings-subtitle">Manage your account and system configuration.</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="card settings-card">
          <h3 className="section-title-mini">Profile Information</h3>
          <div className="profile-hero">
            <div className="avatar settings-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-meta">
              <div className="profile-name">{user?.name}</div>
              <div className="profile-role">{user?.role === 'admin' ? 'Administrator' : 'Student'}</div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input type="text" className="form-input" defaultValue={user?.name} />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" defaultValue={user?.username} disabled />
            <p className="input-hint">Usernames are permanent and cannot be modified.</p>
          </div>
          
          <button className="btn btn-primary settings-btn">Update Profile</button>
        </div>

        <div className="card settings-card">
          <h3 className="section-title-mini">Security</h3>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" className="form-input" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" placeholder="Enter new password" />
          </div>
          <button className="btn btn-outline settings-btn">Change Password</button>
        </div>

        <div className="card settings-card danger-card">
          <h3 className="section-title-mini danger-text">System Control</h3>
          <p className="danger-description">Resetting the platform will delete all students and exam data. This action is irreversible.</p>
          <button className="btn btn-danger-ghost reset-btn">Reset Platform Data</button>
        </div>
      </div>

      <style>{`
        .settings-container {
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 60px;
        }

        .settings-title { font-size: 2rem; font-weight: 800; color: var(--primary); }
        .settings-subtitle { font-size: 0.95rem; color: var(--text-muted); }

        .settings-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card { padding: 32px; background: white; border: 1px solid var(--border-light); }

        .section-title-mini { font-size: 1.1rem; font-weight: 700; color: var(--primary); margin-bottom: 24px; }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }

        .settings-avatar { width: 72px; height: 72px; font-size: 1.75rem; border-radius: 20px; }

        .profile-name { font-size: 1.25rem; font-weight: 800; color: var(--primary); }
        .profile-role { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

        .input-hint { font-size: 0.7rem; color: var(--text-muted); margin-top: 6px; }

        .settings-btn { height: 48px; padding: 0 24px; font-weight: 800; border-radius: 12px; min-width: 160px; }

        .danger-card { border-color: rgba(239, 68, 68, 0.2); }
        .danger-text { color: var(--danger); }
        .danger-description { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; }

        .reset-btn { width: auto; border: 1px solid rgba(239, 68, 68, 0.2); }

        @media (max-width: 768px) {
          .settings-header { text-align: center; }
          .profile-hero { flex-direction: column; text-align: center; }
          .settings-btn { width: 100%; }
          .reset-btn { width: 100%; }
          .settings-card { padding: 24px; }
        }
      `}</style>
    </div>
  )
}
