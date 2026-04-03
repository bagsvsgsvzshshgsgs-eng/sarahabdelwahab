import React, { useState } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { doc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'

export const SettingsPage = () => {
  const { user, login, logout } = useAppContext()
  
  const [displayName, setDisplayName] = useState(user?.name || '')
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPass, setSavingPass] = useState(false)
  const [resetting, setResetting] = useState(false)

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 4000)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!displayName.trim()) return showMsg('Display name is required', 'danger')
    
    setSavingProfile(true)
    try {
      await updateDoc(doc(db, 'admins', user.id), { name: displayName.trim() })
      login({ ...user, name: displayName.trim() })
      showMsg('Profile updated successfully!')
    } catch (err) {
      showMsg('Error updating profile: ' + err.message, 'danger')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) return showMsg('Both password fields are required.', 'danger')
    if (newPassword.length < 6) return showMsg('New password must be at least 6 characters.', 'danger')

    setSavingPass(true)
    try {
      const firebaseUser = auth.currentUser
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword)
      await reauthenticateWithCredential(firebaseUser, credential)
      await updatePassword(firebaseUser, newPassword)
      
      setCurrentPassword('')
      setNewPassword('')
      showMsg('Password changed successfully!')
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        showMsg('Current password is incorrect.', 'danger')
      } else {
        showMsg('Failed to change password: ' + err.message, 'danger')
      }
    } finally {
      setSavingPass(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm("WARNING: This will permanently delete ALL students, exam submissions, and login logs. Are you completely sure?")) return
    if (!window.confirm("FINAL WARNING: This action cannot be reversed! Type 'OK' to proceed.") !== 'OK') return // Just a secondary mental check, actually let's use a simpler prompt
    
    const confirmWord = window.prompt("Type 'DELETE' to confirm full platform reset:")
    if (confirmWord !== 'DELETE') return

    setResetting(true)
    try {
      // Helper to clear collections
      const clearCollection = async (collName) => {
        const snap = await getDocs(collection(db, collName))
        const promises = snap.docs.map(d => deleteDoc(doc(db, collName, d.id)))
        await Promise.all(promises)
      }

      await clearCollection('submissions')
      await clearCollection('students')
      await clearCollection('loginLogs')
      
      showMsg('Platform reset successfully. All data wiped.')
    } catch (err) {
      showMsg('Failed to reset platform: ' + err.message, 'danger')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="settings-container fade-in">
      <div className="page-header settings-header">
        <div className="page-header-text">
          <h1 className="settings-title">Platform Settings</h1>
          <p className="settings-subtitle">Manage your account and system configuration.</p>
        </div>
      </div>

      {msg.text && (
        <div style={{
          padding: '16px', borderRadius: '12px', fontSize: '0.9rem',
          fontWeight: '700', marginBottom: '24px',
          background: msg.type === 'danger' ? 'var(--danger-light)' : '#d1fae5',
          color: msg.type === 'danger' ? 'var(--danger)' : '#065f46',
          border: `1px solid ${msg.type === 'danger' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
        }}>
          {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
        </div>
      )}

      <div className="settings-content">
        <div className="card settings-card">
          <h3 className="section-title-mini">Profile Information</h3>
          <div className="profile-hero">
            <div className="avatar settings-avatar" style={{ background: 'var(--primary)', color: 'white', fontWeight: '800' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-meta">
              <div className="profile-name">{user?.name}</div>
              <div className="profile-role">{user?.role === 'admin' ? 'Administrator' : 'Instructor'}</div>
            </div>
          </div>
          
          <form onSubmit={handleUpdateProfile}>
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
              <label className="form-label">Admin Email / Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={user?.email || 'admin@sarahapp.edu'} 
                disabled 
                style={{ background: '#f8fafc', color: 'var(--text-muted)' }}
              />
              <p className="input-hint">Admin aliases are permanent and cannot be modified.</p>
            </div>
            
            <button type="submit" className="btn btn-primary settings-btn" disabled={savingProfile}>
              {savingProfile ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="card settings-card">
          <h3 className="section-title-mini">Security</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter current password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Min. 6 characters" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline settings-btn" disabled={savingPass}>
              {savingPass ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        <div className="card settings-card danger-card">
          <h3 className="section-title-mini danger-text">System Control</h3>
          <p className="danger-description">
            Resetting the platform will delete ALL student accounts, submissions, and login logs 
            permanently from Firebase. (Exams will be kept format). This action is irreversible.
          </p>
          <button 
            type="button" 
            onClick={handleReset} 
            className="btn btn-danger-ghost reset-btn" 
            disabled={resetting}
          >
            {resetting ? 'Deleting Database...' : 'Reset Platform Data'}
          </button>
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

        .settings-btn { height: 48px; padding: 0 24px; font-weight: 800; border-radius: 12px; min-width: 160px; margin-top: 8px; }

        .danger-card { border-color: rgba(239, 68, 68, 0.2); }
        .danger-text { color: var(--danger); }
        .danger-description { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }

        .reset-btn { width: auto; border: 1px solid rgba(239, 68, 68, 0.2); font-weight: 700; height: 48px; padding: 0 24px; border-radius: 12px; }

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
