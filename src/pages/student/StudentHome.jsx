import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { getPublished, getResultsByStudent } from '../../utils/storage'

export const StudentHome = () => {
  const { user } = useAppContext()
  const [exams, setExams] = useState([])
  const [results, setResults] = useState([])

  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!user) return
    setLoading(true)
    try {
      const allPublished = await getPublished()
      const myResults = await getResultsByStudent(user.id)
      
      // Filter by Grade Level
      // Show exams targeted to 'All' or students matching the specific grade
      const filteredExams = allPublished.filter(hw => 
        hw.targetGrade === 'All' || hw.targetGrade === (user.grade || 'All')
      )

      setExams(filteredExams)
      setResults(myResults)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  // Figure out which exams are completed vs pending
  const completedHomeworkIds = results.map(r => r.homeworkId)
  
  const pendingExams = exams.filter(hw => !completedHomeworkIds.includes(hw.id))
  const completedExams = exams.filter(hw => completedHomeworkIds.includes(hw.id))

  return (
    <div className="fade-in">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <div className="page-header-text">
          <h1>Welcome, {user?.name}!</h1>
          <p>Ready to continue your learning journey? Here is your personalized overview.</p>
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <div className="section-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>📝 Pending Evaluations</span>
            <span className="badge badge-danger" style={{ fontSize: '0.65rem', padding: '4px 8px' }}>{pendingExams.length} REQUIRED</span>
          </h2>
        </div>
        
        {pendingExams.length === 0 ? (
          <div className="card empty-state">
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>All Caught Up!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You have no pending exams at the moment.</p>
          </div>
        ) : (
          <div className="student-exam-grid">
            {pendingExams.map(hw => (
              <div key={hw.id} className="card card-hover student-exam-card">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '1.1rem' }}>
                  📖
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>{hw.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1, marginBottom: '20px', lineHeight: '1.5' }}>{hw.description || 'No specific instructions provided.'}</p>
                
                <div className="exam-details-row">
                  <div className="exam-detail-pill">
                     <span className="exam-detail-label">Questions</span>
                     <span className="exam-detail-value">{hw.questions?.length || 0}</span>
                  </div>
                  <div style={{ width: '1px', height: '20px', background: 'var(--border-light)' }}></div>
                  <div className="exam-detail-pill">
                     <span className="exam-detail-label">Format</span>
                     <span className="exam-detail-value">Quiz</span>
                  </div>
                </div>

                <Link to={`/student/quiz/${hw.id}`} className="btn btn-primary start-btn">
                  Start Assessment →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="section-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✅ Performance History
          </h2>
        </div>

        {completedExams.length === 0 ? (
          <div className="card empty-state-small">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No completed exams yet.</p>
          </div>
        ) : (
          <div className="student-exam-grid">
            {completedExams.map(hw => {
              const result = results.find(r => r.homeworkId === hw.id)
              return (
                <div key={hw.id} className="card result-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)', maxWidth: '70%' }}>{hw.title}</h3>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '1.2rem', fontWeight: '800', color: result.percentage >= 60 ? 'var(--success)' : 'var(--danger)' }}>{result.percentage}%</div>
                       <div style={{ fontSize: '0.6rem', fontWeight: '700', opacity: '0.6' }}>SCORE</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                     <span className={`badge ${result.percentage >= 60 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.6rem' }}>
                       {result.percentage >= 60 ? 'PASSED' : 'FAILED'}
                     </span>
                     <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(result.submittedAt).toLocaleDateString()}</span>
                  </div>

                  <Link to={`/student/result/${result.id}`} className="btn btn-outline" style={{ height: '42px', fontSize: '0.85rem' }}>
                    View Results
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        .student-exam-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .student-exam-card {
          padding: 24px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .empty-state {
          padding: 60px 24px;
          text-align: center;
          border: 2px dashed var(--border-light);
          background: transparent;
        }

        .empty-state-small {
          padding: 40px 24px;
          text-align: center;
          color: var(--text-muted);
        }

        .exam-details-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .exam-detail-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .exam-detail-label {
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .exam-detail-value {
          font-size: 0.85rem;
          font-weight: 800;
        }

        .start-btn {
          width: 100%;
          height: 48px;
        }

        @media (max-width: 1024px) {
          .student-exam-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .page-header {
            text-align: center;
            margin-bottom: 32px !important;
          }
        }
      `}</style>
    </div>
  )
}
