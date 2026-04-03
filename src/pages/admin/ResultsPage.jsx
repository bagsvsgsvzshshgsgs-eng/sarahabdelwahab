import React, { useState, useEffect } from 'react'
import { getSubmissions, getStudents, getHomework } from '../../utils/storage'

export const ResultsPage = () => {
  const [submissions, setSubmissions] = useState([])
  const [studentsMap, setStudentsMap] = useState({})
  const [homeworksMap, setHomeworksMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [filterHomework, setFilterHomework] = useState('all')
  const [filterStudent, setFilterStudent]   = useState('all')

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      const [studentsList, homeworkList, subs] = await Promise.all([
        getStudents(),
        getHomework(),
        getSubmissions(),
      ])

      const smap = {}
      studentsList.forEach(s => (smap[s.id] = s))
      setStudentsMap(smap)

      const hmap = {}
      homeworkList.forEach(h => (hmap[h.id] = h))
      setHomeworksMap(hmap)

      setSubmissions(subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)))
      setLoading(false)
    })()
  }, [])

  const homeworks = Object.values(homeworksMap)
  const students  = Object.values(studentsMap)

  const filtered = submissions.filter(r => {
    const hwOk = filterHomework === 'all' || r.homeworkId === filterHomework
    const stOk = filterStudent  === 'all' || r.studentId  === filterStudent
    return hwOk && stOk
  })

  // Stats
  const totalSubs   = filtered.length
  const avgPct      = totalSubs > 0
    ? Math.round(filtered.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalSubs)
    : 0
  const passCount   = filtered.filter(r => (r.percentage || 0) >= 60).length

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Student Results</h1>
          <p>Review all submitted exams. Every submission is stored in Firestore with full details.</p>
        </div>
      </div>

      {/* Stats Row */}
      {!loading && totalSubs > 0 && (
        <div className="results-stats-row">
          <div className="results-stat-card">
            <div className="stat-value">{totalSubs}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
          <div className="results-stat-card">
            <div className="stat-value">{passCount}</div>
            <div className="stat-label">Passed</div>
          </div>
          <div className="results-stat-card">
            <div className="stat-value">{totalSubs - passCount}</div>
            <div className="stat-label">Failed</div>
          </div>
          <div className="results-stat-card">
            <div className="stat-value" style={{ color: avgPct >= 60 ? 'var(--success)' : 'var(--danger)' }}>{avgPct}%</div>
            <div className="stat-label">Class Average</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="results-filters">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <select
            className="form-input filter-select"
            value={filterHomework}
            onChange={e => setFilterHomework(e.target.value)}
          >
            <option value="all">All Exams</option>
            {homeworks.map(h => (
              <option key={h.id} value={h.id}>{h.title}</option>
            ))}
          </select>

          <select
            className="form-input filter-select"
            value={filterStudent}
            onChange={e => setFilterStudent(e.target.value)}
          >
            <option value="all">All Students</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {(filterHomework !== 'all' || filterStudent !== 'all') && (
          <button
            className="btn btn-outline"
            style={{ height: '44px', padding: '0 16px', fontSize: '0.85rem' }}
            onClick={() => { setFilterHomework('all'); setFilterStudent('all') }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Loading results...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th className="desktop-only text-center">Score</th>
                <th className="desktop-only text-center">✅ Correct</th>
                <th className="desktop-only text-center">❌ Wrong</th>
                <th className="text-center">%</th>
                <th className="desktop-only text-right">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                      No Results Yet
                    </h3>
                    <p style={{ color: 'var(--text-muted)' }}>
                      As students complete exams, their performance data will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const student     = studentsMap[r.studentId]
                  const hw          = homeworksMap[r.homeworkId]
                  const studentName = r.studentName || (student ? student.name : 'Unknown')
                  const initial     = studentName.charAt(0).toUpperCase()
                  const examTitle   = hw ? hw.title : (r.homeworkTitle || 'Deleted Exam')
                  const passed      = (r.percentage || 0) >= 60

                  // Derive correct/wrong if not stored
                  const correct = r.correctAnswers ?? '—'
                  const wrong   = r.wrongAnswers   ?? '—'

                  return (
                    <tr key={r.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem', borderRadius: '10px', flexShrink: 0 }}>
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.85rem' }}>
                              {studentName}
                            </div>
                            {student?.grade && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{student.grade}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{
                          fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)',
                          maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {examTitle}
                        </div>
                      </td>

                      <td className="desktop-only text-center">
                        <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                          {r.score}{' '}
                          <span style={{ fontWeight: '400', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            / {r.totalScore}
                          </span>
                        </span>
                      </td>

                      <td className="desktop-only text-center">
                        <span style={{ color: 'var(--success)', fontWeight: '800', fontSize: '0.85rem' }}>
                          {correct}
                        </span>
                      </td>

                      <td className="desktop-only text-center">
                        <span style={{ color: 'var(--danger)', fontWeight: '800', fontSize: '0.85rem' }}>
                          {wrong}
                        </span>
                      </td>

                      <td className="text-center">
                        <span
                          className={`badge ${passed ? 'badge-success' : 'badge-danger'}`}
                          style={{ fontSize: '0.75rem', fontWeight: '800' }}
                        >
                          {r.percentage}%
                        </span>
                      </td>

                      <td className="desktop-only text-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .text-center { text-align: center; }
        .text-right  { text-align: right; }

        .results-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .results-stat-card {
          background: white;
          border: 1px solid var(--border-light);
          border-radius: 16px;
          padding: 20px 24px;
          text-align: center;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .results-filters {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-select {
          height: 44px;
          padding: 0 12px;
          font-size: 0.85rem;
          border-radius: 10px;
          min-width: 180px;
        }

        @media (max-width: 1024px) {
          .page-header { text-align: center; }
          .results-stats-row { grid-template-columns: repeat(2, 1fr); }
          .results-filters { flex-direction: column; align-items: stretch; }
          .filter-select { width: 100%; }
        }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .results-stats-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  )
}
