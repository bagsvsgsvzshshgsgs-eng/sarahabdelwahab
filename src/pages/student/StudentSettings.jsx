import React, { useState } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'

export const StudentSettings = () => {
  const { user, login } = useAppContext()
  const [displayName, setDisplayName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [saving, setSaving] = useState(false)

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 4000)
  }

  const handleUpdateName = async (e) => {
    e.preventDefault()
    if (!displayName.trim()) {
      showMsg('Display name cannot be empty.', 'danger')
      return
    }
    setSaving(true)
    try {
      await updateDoc(doc(db, 'students', user.id), { name: displayName.trim() })
      login({ ...user, name: displayName.trim() })
      showMsg('Display name updated successfully!')
    } catch (err) {
      showMsg('Failed to update name. ' + err.message, 'danger')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      showMsg('All password fields are required.', 'danger')
      return
    }
    if (newPassword !== confirmPassword) {
      showMsg('New passwords do not match.', 'danger')
      return
    }
    if (newPassword.length < 6) {
      showMsg('New password must be at least 6 characters.', 'danger')
      return
    }

    setSaving(true)
    try {
      const firebaseUser = auth.currentUser
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword)
      await reauthenticateWithCredential(firebaseUser, credential)
      // Update password
      await updatePassword(firebaseUser, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showMsg('Password changed successfully!')
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        showMsg('Current password is incorrect.', 'danger')
      } else {
        showMsg('Failed to change password: ' + err.message, 'danger')
      }
    } finally {
      setSaving(false)
    }
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

        {/* Profile Card */}
        <div className="card settings-card">
          <h3 className="section-title-mini">Account Details</h3>

          <div className="profile-hero">
            <div className="avatar settings-avatar" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-meta">
              <div className="profile-name">{user?.name}</div>
              <div className="profile-role">@{user?.username} · {user?.grade}</div>
            </div>
          </div>

          <form onSubmit={handleUpdateName}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={user?.username}
                disabled
                style={{ background: '#f1f5f9', color: 'var(--text-muted)' }}
              />
              <p className="input-hint">Your unique identifier cannot be changed. Powered by Firebase.</p>
            </div>

            <button type="submit" className="btn btn-primary settings-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Name'}
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="card settings-card">
          <h3 className="section-title-mini">Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>

            {msg.text && (
              <div style={{
                padding: '12px', borderRadius: '12px', fontSize: '0.85rem',
                fontWeight: '600', marginBottom: '16px',
                background: msg.type === 'danger' ? 'var(--danger-light)' : '#d1fae5',
                color: msg.type === 'danger' ? 'var(--danger)' : '#065f46',
              }}>
                {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
              </div>
            )}

            <button type="submit" className="btn btn-outline settings-btn" disabled={saving}>
              {saving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="card settings-card" style={{ background: '#f8fafc' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
            🔒 Secure Cloud Storage
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Your account is secured by Firebase Authentication. Your exam results and progress are stored in
            Firestore and accessible from any device. To reset your account data, contact Sarah Abdelwahab.
          </p>
        </div>

      </div>

      <style>{`
        .settings-container { max-width: 600px; margin: 0 auto; padding: 0 20px 80px; }
        .settings-header { text-align: left; }
        .settings-title { font-size: 2rem; font-weight: 800; color: var(--primary); }
        .settings-subtitle { font-size: 0.95rem; color: var(--text-muted); }

        .settings-content { display: flex; flex-direction: column; gap: 24px; }
        .settings-card { padding: 32px; background: white; border: 1px solid var(--border-light); }
        .section-title-mini { font-size: 1rem; font-weight: 800; color: var(--primary); margin-bottom: 24px; }

        .profile-hero { display: flex; align-items: center; gap: 20px; margin-bottom: 32px; }
        .settings-avatar { width: 72px; height: 72px; font-size: 1.75rem; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .profile-name { font-size: 1.25rem; font-weight: 800; color: var(--primary); }
        .profile-role { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }

        .input-hint { font-size: 0.7rem; color: var(--text-muted); margin-top: 6px; }
        .settings-btn { height: 52px; width: 100%; font-weight: 800; border-radius: 12px; margin-top: 8px; }

        @media (max-width: 768px) {
          .settings-header { text-align: center; }
          .profile-hero { flex-direction: column; text-align: center; }
          .settings-card { padding: 24px; }
        }
      `}</style>
    </div>
  )
}
