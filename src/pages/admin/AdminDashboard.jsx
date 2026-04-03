import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStudents, getPublished, getResults } from '../../utils/storage'

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, published: 0, results: 0, avgScore: 0 })
  const [recentResults, setRecentResults] = useState([])
  const [students, setStudents] = useState([])

  useEffect(() => {
    const allStudents = getStudents()
    const allResults = getResults()
    const allHomework = getPublished()
    
    // Enrich results with student and homework info
    const enrichedResults = allResults.map(res => {
      const student = allStudents.find(s => s.id === res.studentId)
      const homework = allHomework.find(hw => hw.id === res.homeworkId)
      return {
        ...res,
        studentName: student ? student.name : 'Unknown Student',
        quizTitle: homework ? homework.title : 'Deleted Exam'
      }
    })

    // Calculate Average
    let avg = 0
    if (allResults.length > 0) {
      const sum = allResults.reduce((acc, r) => acc + r.percentage, 0)
      avg = Math.round(sum / allResults.length)
    }

    setStats({
      students: allStudents.length,
      published: allHomework.length,
      results: allResults.length,
      avgScore: avg
    })
    
    setStudents(allStudents.slice(0, 5))
    setRecentResults([...enrichedResults].sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5))
  }, [])

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Admin Overview</h1>
          <p>Welcome back, Sarah! Here's the latest pulse on your activities.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/homework" className="btn btn-outline">
            <span>📚</span> Manage Exams
          </Link>
          <Link to="/admin/students" className="btn btn-primary">
            <span>➕</span> New Student
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card card-hover">
          <div className="stat-header">
            <div className="stat-label">Total Students</div>
            <div className="stat-icon-box accent-blue">👥</div>
          </div>
          <div className="stat-value">{stats.students}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700' }}>↑ 12% from last month</div>
        </div>

        <div className="card stat-card card-hover">
          <div className="stat-header">
            <div className="stat-label">Active Exams</div>
            <div className="stat-icon-box accent-purple">📝</div>
          </div>
          <div className="stat-value">{stats.published}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Currently live</div>
        </div>

        <div className="card stat-card card-hover">
          <div className="stat-header">
            <div className="stat-label">Total Submissions</div>
            <div className="stat-icon-box accent-green">📥</div>
          </div>
          <div className="stat-value">{stats.results}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700' }}>↑ 8 new today</div>
        </div>

        <div className="card stat-card card-hover">
          <div className="stat-header">
            <div className="stat-label">Averge Performance</div>
            <div className="stat-icon-box accent-orange">📈</div>
          </div>
          <div className="stat-value">{stats.avgScore}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class average score</div>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Recent Results Table */}
        <div className="table-wrapper">
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Recent Submissions</h3>
            <Link to="/admin/results" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '600' }}>View All →</Link>
          </div>
          <table className="saas-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Performance</th>
                <th className="desktop-only">Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '60px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No recent submissions Yet</p>
                  </td>
                </tr>
              ) : recentResults.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.9rem' }}>{r.studentName}</span>
                       <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.quizTitle}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', width: '40px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.percentage}%`, background: r.percentage >= 60 ? 'var(--success)' : 'var(--danger)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: r.percentage >= 60 ? 'var(--success)' : 'var(--danger)' }}>{r.percentage}%</span>
                    </div>
                  </td>
                  <td className="desktop-only" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(r.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge ${r.percentage >= 60 ? 'badge-success' : 'badge-danger'}`}>
                      {r.percentage >= 60 ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Lists */}
        <div className="sidebar-lists">
          
          <div className="card">
             <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Quick Actions</h3>
             <div className="quick-actions-grid">
               <Link to="/admin/students/new" className="action-tile">
                  <span className="action-icon">👤</span>
                  <span className="action-label">Add Student</span>
               </Link>
               <Link to="/admin/homework/new" className="action-tile">
                  <span className="action-icon">📝</span>
                  <span className="action-label">Create Exam</span>
               </Link>
               <Link to="/admin/results" className="action-tile">
                  <span className="action-icon">📊</span>
                  <span className="action-label">View Results</span>
               </Link>
               <Link to="/admin/settings" className="action-tile">
                  <span className="action-icon">⚙️</span>
                  <span className="action-label">Settings</span>
               </Link>
             </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px' }}>Newly Enrolled</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {students.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent sign ups</p>
              ) : students.map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '12px', transition: '0.2s' }}>
                  <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>{s.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Joined {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/students" className="btn btn-outline" style={{ width: '100%', marginTop: '24px', fontSize: '0.85rem' }}>
              View Student Roster
            </Link>
          </div>

          <div className="card accent-blue" style={{ border: 'none', background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '12px' }}>Platform Tip</h3>
            <p style={{ fontSize: '0.9rem', opacity: '0.9', lineHeight: '1.5' }}>
              You can now export student results directly to Excel from the Results tab. Try it out!
            </p>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginTop: '20px', fontSize: '0.85rem' }}>Learn More</button>
          </div>

        </div>

      </div>

      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
          align-items: start;
        }

        .sidebar-lists {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .sidebar-lists {
            gap: 24px;
          }

          .quick-actions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .action-tile {
            padding: 16px;
            background: var(--bg-app);
            border: 1px solid var(--border-light);
            border-radius: 12px;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            transition: var(--transition);
          }

          .action-tile:hover {
            border-color: var(--accent);
            transform: translateY(-2px);
          }

          .action-icon { font-size: 1.25rem; }
          .action-label { font-size: 0.75rem; font-weight: 800; color: var(--primary); text-align: center; }

          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }

          .page-header-text {
            text-align: center;
          }

          .page-header .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
