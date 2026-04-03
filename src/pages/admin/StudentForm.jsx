import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { findUser, saveUser } from '../../utils/storage'

export const StudentForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [formData, setFormData] = useState({ name: '', username: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEditing) {
      const student = findUser(id)
      if (student && student.role === 'student') {
        setFormData({ name: student.name, username: student.username, password: student.password })
      } else {
        navigate('/admin/students')
      }
    }
  }, [id, navigate, isEditing])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.username || !formData.password) {
      setError('All fields are required.')
      return
    }

    const newStudent = {
      id: isEditing ? id : `s-${Date.now()}`,
      role: 'student',
      name: formData.name,
      username: formData.username.toLowerCase().trim(),
      password: formData.password
    }

    saveUser(newStudent)
    navigate('/admin/students')
  }

  return (
    <div className="form-page-mini">
      <div className="page-header form-header">
        <div className="page-header-text">
          <Link to="/admin/students" className="back-link">
            ← Back to Students
          </Link>
          <h1 className="form-title">{isEditing ? 'Edit Student' : 'Add Student'}</h1>
          <p className="form-subtitle">Provision secure platform access.</p>
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
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. johnd"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Set secure password"
            />
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-btn">{isEditing ? 'Save Changes' : 'Add Student'}</button>
            <Link to="/admin/students" className="btn btn-outline cancel-btn">Cancel</Link>
          </div>
        </form>
      </div>

      <style>{`
        .form-page-mini {
          max-width: 500px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }

        .back-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
        }

        .form-title { font-size: 1.75rem; font-weight: 800; color: var(--primary); }
        .form-subtitle { font-size: 0.9rem; color: var(--text-muted); }

        .form-card {
          padding: 32px;
          background: white;
          border-radius: 20px;
          border: 1px solid var(--border-light);
        }

        .form-actions {
          display: flex;
          flex-direction: row-reverse;
          gap: 12px;
          margin-top: 32px;
        }

        .submit-btn, .cancel-btn {
          height: 48px;
          padding: 0 24px;
          border-radius: 12px;
          font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
        }

        .submit-btn { flex: 2; }
        .cancel-btn { flex: 1; }

        @media (max-width: 768px) {
          .form-header { text-align: center; }
          .form-actions { flex-direction: column; }
          .submit-btn, .cancel-btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}
