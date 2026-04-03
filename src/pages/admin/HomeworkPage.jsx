import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getHomework, deleteHomework, saveHomework } from '../../utils/storage'

export const HomeworkPage = () => {
  const [homeworks, setHomeworks] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadData = async () => {
    setLoading(true)
    const data = await getHomework()
    setHomeworks(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will delete the exam and all results.')) {
      setLoading(true)
      await deleteHomework(id)
      await loadData()
    }
  }

  const togglePublish = async (hw) => {
    setLoading(true)
    await saveHomework({ ...hw, published: !hw.published })
    await loadData()
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Exam Inventory</h1>
          <p>You have {homeworks.length} total exams in your repository. Manage and distribute them with ease.</p>
        </div>
        <Link to="/admin/homework/new" className="btn btn-primary" style={{ height: '48px' }}>
          <span>📝</span> Create New Exam
        </Link>
      </div>

      <div className="exam-grid">
        {homeworks.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 24px', border: '2px dashed var(--border-light)', background: 'transparent' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>📚</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>No Exams Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>Your exam repository is currently empty. Start by creating a new evaluation.</p>
            <Link to="/admin/homework/new" className="btn btn-primary">Begin Exam Creation</Link>
          </div>
        ) : (
          homeworks.map(hw => (
            <div key={hw.id} className="card card-hover exam-card">
              <div className="exam-status">
                <span className={`badge ${hw.published ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                  {hw.published ? ' • PUBLISHED' : ' • DRAFT'}
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: hw.published ? 'var(--success-light)' : 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '1.2rem' }}>
                   {hw.published ? '✅' : '⏳'}
                 </div>
                 <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px', lineHeight: '1.2' }}>{hw.title}</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                   {hw.description || 'No description provided for this evaluation.'}
                 </p>
              </div>
              
              <div className="exam-stats">
                 <div className="stat-pill">
                    <span className="stat-label-tiny">Items</span>
                    <span className="stat-value-mid">{hw.questions?.length || 0} Qs</span>
                 </div>
                 <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>
                 <div className="stat-pill">
                    <span className="stat-label-tiny">Created</span>
                    <span className="stat-value-mid">{new Date(hw.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>
              
              <div className="exam-actions">
                <button onClick={() => togglePublish(hw)} className="btn btn-outline btn-sm-flexible">
                  {hw.published ? 'Unpublish' : 'Go Live'}
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <Link to={`/admin/homework/${hw.id}/edit`} className="btn btn-outline" style={{ width: '42px', height: '42px', padding: '0', flexShrink: 0 }} title="Edit Content">✏️</Link>
                   <button onClick={() => handleDelete(hw.id)} className="btn btn-outline" style={{ width: '42px', height: '42px', padding: '0', color: 'var(--danger)', flexShrink: 0 }} title="Remove Permanently">🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .exam-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .exam-card {
          display: flex;
          flex-direction: column;
          padding: 24px;
          position: relative;
        }

        .exam-status {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .exam-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          margin-top: auto;
          align-items: center;
        }

        .stat-pill {
          display: flex;
          flex-direction: column;
        }

        .stat-label-tiny {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .stat-value-mid {
          font-size: 0.85rem;
          font-weight: 800;
        }

        .exam-actions {
          display: flex;
          gap: 10px;
        }

        .btn-sm-flexible {
          flex: 1;
          height: 42px;
          font-size: 0.85rem;
        }

        @media (max-width: 1024px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            text-align: center;
          }
          .page-header .btn { width: 100%; }

          .exam-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  )
}
