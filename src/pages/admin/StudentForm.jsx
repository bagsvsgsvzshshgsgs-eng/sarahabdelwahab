import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { findUser } from '../../utils/storage'
import { createStudentAccount, setStudentPendingPassword, toEmail } from '../../utils/firebaseAuth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'

const GRADES = [
  'Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6',
  'Secondary 1','Secondary 2','Secondary 3',
]

export const StudentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    grade: 'Primary 1',
  })
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Store admin credentials briefly to re-login after creating student
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminFields, setShowAdminFields] = useState(false)

  useEffect(() => {
    ;(async () => {
      setPageLoading(true)
      if (isEditing) {
        const student = await findUser(id)
        if (student && student.role === 'student') {
          setFormData({
            name: student.name,
            username: student.username,
            password: '',
            grade: student.grade || 'Primary 1',
          })
        } else {
          navigate('/admin/students')
        }
      }
      setPageLoading(false)
    })()
  }, [id, navigate, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.name.trim() || !formData.username.trim()) {
      setError('Name and username are required.')
      return
    }
    if (!isEditing && !formData.password) {
      setError('Password is required for new students.')
      return
    }
    if (!isEditing && !adminEmail) {
      setShowAdminFields(true)
      setError('Please enter your admin credentials below so the system can re-login after creating the student account.')
      return
    }

    setSaving(true)

    try {
      if (isEditing) {
        // Update Firestore profile fields
        const updates = { name: formData.name, grade: formData.grade }
        await updateDoc(doc(db, 'students', id), updates)

        // If admin typed a new password, queue it as pendingPassword
        if (formData.password) {
          await setStudentPendingPassword(id, formData.password)
          setSuccess('Profile updated. Password will be applied on student\'s next login.')
        } else {
          setSuccess('Profile updated successfully.')
        }

        setTimeout(() => navigate('/admin/students'), 1200)
      } else {
        // CREATE: Firebase Auth + Firestore doc
        // Note: createUserWithEmailAndPassword signs in the new user.
        // We must re-sign in the admin afterward.
        await createStudentAccount({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          grade: formData.grade,
        })

        // Re-sign in the admin
        try {
          await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
        } catch {
          // Admin re-auth failed — navigate anyway, context will clear
          navigate('/admin/students')
          return
        }

        navigate('/admin/students')
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError(`Username "${formData.username}" is already taken. Please choose a different username.`)
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError(err.message || 'Failed to save student. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (pageLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'80px', flexDirection:'column', gap:'16px' }}>
        <div style={{ fontSize:'2rem' }}>⏳</div>
        <p style={{ fontWeight:'700', color:'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="form-page-mini">
      <div className="page-header form-header">
        <div className="page-header-text">
          <Link to="/admin/students" className="back-link">← Back to Students</Link>
          <h1 className="form-title">{isEditing ? 'Edit Student' : 'Add New Student'}</h1>
          <p className="form-subtitle">
            {isEditing
              ? 'Update student profile and optionally reset their password.'
              : 'Creates a real Firebase account — student can log in from any device.'}
          </p>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Grade Level</label>
            <select
              className="form-input select-input"
              value={formData.grade}
              onChange={e => setFormData({ ...formData, grade: e.target.value })}
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().trim() })}
              placeholder="e.g. johndoe"
              disabled={isEditing}
              style={isEditing ? { background: '#f1f5f9', color: 'var(--text-muted)' } : {}}
            />
            {isEditing && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Usernames cannot be changed after creation.
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder={isEditing ? 'Enter new password to reset' : 'Min. 6 characters'}
            />
            {isEditing && formData.password && (
              <p style={{ fontSize: '0.72rem', color: 'var(--accent)', marginTop: '6px', fontWeight: '600' }}>
                ⚠️ Password will be applied on the student's next login.
              </p>
            )}
          </div>

          {/* Admin re-auth section — only shown when creating a new student */}
          {!isEditing && showAdminFields && (
            <div style={{ marginTop: '24px', padding: '20px', background: '#fff8e1', border: '1px solid #fbbf24', borderRadius: '16px' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#92400e', marginBottom: '16px' }}>
                🔐 Enter YOUR admin credentials to stay logged in after creating this account:
              </p>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Your Admin Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value.includes('@') ? e.target.value : `${e.target.value.toLowerCase().trim()}@sarahapp.edu`)}
                  placeholder="Your admin username (e.g. kamel)"
                  style={{ height: '44px', fontSize: '0.85rem' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Your Admin Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Your admin password"
                  style={{ height: '44px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '16px', padding: '12px',
              background: 'var(--danger-light)', color: 'var(--danger)',
              borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600',
            }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{
              marginTop: '16px', padding: '12px',
              background: '#d1fae5', color: '#065f46',
              borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600',
            }}>
              ✅ {success}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-btn" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Student Account'}
            </button>
            <Link to="/admin/students" className="btn btn-outline cancel-btn">Cancel</Link>
          </div>
        </form>
      </div>

      <style>{`
        .form-page-mini { max-width: 560px; margin: 0 auto; padding: 0 20px 60px; }

        .back-link {
          color: var(--text-muted); text-decoration: none;
          font-size: 0.85rem; font-weight: 600; display: block; margin-bottom: 8px;
        }

        .form-title { font-size: 1.75rem; font-weight: 800; color: var(--primary); }
        .form-subtitle { font-size: 0.9rem; color: var(--text-muted); margin-top: 4px; }

        .form-card {
          padding: 32px; background: white;
          border-radius: 20px; border: 1px solid var(--border-light);
        }

        .form-actions {
          display: flex; flex-direction: row-reverse;
          gap: 12px; margin-top: 32px;
        }

        .submit-btn, .cancel-btn {
          height: 48px; padding: 0 24px; border-radius: 12px;
          font-weight: 800; display: flex; align-items: center;
          justify-content: center; text-decoration: none;
        }

        .submit-btn { flex: 2; }
        .cancel-btn { flex: 1; }

        .select-input { cursor: pointer; }

        @media (max-width: 768px) {
          .form-header { text-align: center; }
          .form-actions { flex-direction: column; }
          .submit-btn, .cancel-btn { width: 100%; flex: none; }
        }
      `}</style>
    </div>
  )
}
