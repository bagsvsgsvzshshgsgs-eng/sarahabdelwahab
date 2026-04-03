import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { loginAdmin } from '../../utils/auth'

export const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAppContext()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginAdmin(username, password)
      if (res.success) {
        login(res.user)
        navigate('/admin/dashboard')
      } else {
        setError(res.message)
        setLoading(false)
      }
    } catch (err) {
      setError('An authentication error occurred. Please check your connection.')
      setLoading(false)
    }
  }

  return (
    <div className="split-layout">
      <style>{`
        .login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          padding: 48px;
          border-radius: 24px;
          box-shadow: var(--shadow-xl);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 5;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .deco-blob {
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 0;
        }

        .back-nav {
          position: absolute;
          top: 32px; right: 32px;
          z-index: 20;
        }

        .form-label-premium {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .glass-badge {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          width: fit-content;
        }

        @media (max-width: 1024px) {
          .back-nav {
            position: relative;
            top: 0; right: 0;
            margin-bottom: 24px;
            text-align: center;
          }
          .split-left { padding: 60px 24px 40px; }
          .split-left h1 { font-size: 2.25rem !important; }
        }
      `}</style>

      {/* LEFT COLUMN */}
      <div className="split-left">
        <div className="deco-blob desktop-only" style={{ top: '-100px', right: '-100px' }}></div>
        <div className="deco-blob desktop-only" style={{ bottom: '-150px', left: '-50px' }}></div>

        <div className="left-content" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="glass-badge" style={{ marginBottom: '24px' }}>V2.0 — Firebase Powered</div>

          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', fontWeight: '800', marginBottom: '16px' }}>
            Elevate Your <br />
            <span style={{ color: '#60a5fa' }}>Teaching Experience</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '32px', maxWidth: '440px' }}>
            The ultimate command center for Sarah Abdelwahab's educational excellence.
          </p>

          <div className="desktop-only" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🛡️</div>
              <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '4px' }}>Firebase Auth</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Enterprise-grade security</p>
            </div>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📊</div>
              <p style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '4px' }}>Track Everything</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Logins & submissions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="split-right">
        <div className="back-nav">
          <Link to="/student/login" className="btn btn-outline" style={{ borderRadius: '99px', fontSize: '0.8rem', padding: '10px 24px' }}>
            Student Portal →
          </Link>
        </div>

        <div className="login-card">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', marginBottom: '20px' }}>
              <img src="/sarah-profile.jpg" alt="Sarah Abdelwahab" style={{ width: '80px', height: '120px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Administrator Login
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label-premium" htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                className="form-input"
                type="text"
                placeholder="Admin username (e.g. sarahabdelwahab)"
                value={username}
                onChange={e => { setUsername(e.target.value); setError('') }}
                required
                autoFocus
                style={{ background: '#f8fafc' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label-premium" htmlFor="admin-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Personal access key"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  style={{ paddingRight: '48px', background: '#f8fafc' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex="-1"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94a3b8', padding: '4px' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px' }} disabled={loading || !username || !password}>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
