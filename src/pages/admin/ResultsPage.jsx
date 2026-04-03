import React, { useState, useEffect } from 'react'
import { getResults, getStudents, getHomework } from '../../utils/storage'

export const ResultsPage = () => {
  const [results, setResults] = useState([])
  const [studentsMap, setStudentsMap] = useState({})
  const [homeworksMap, setHomeworksMap] = useState({})

  useEffect(() => {
    // build dictionaries for quick lookup
    const studentsList = getStudents()
    const smap = {}
    studentsList.forEach(s => smap[s.id] = s)
    setStudentsMap(smap)

    const homeworkList = getHomework()
    const hmap = {}
    homeworkList.forEach(h => hmap[h.id] = h)
    setHomeworksMap(hmap)

    const res = getResults().sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    setResults(res)
  }, [])

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Student Results</h1>
          <p>Review and analyze all submitted exams and student scores.</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Evaluation</th>
              <th className="desktop-only text-center">Raw Score</th>
              <th className="text-center">Performance</th>
              <th className="desktop-only text-right">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '80px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>No Results Yet</h3>
                  <p style={{ color: 'var(--text-muted)' }}>As students complete exams, their detailed performance metrics will appear here.</p>
                </td>
              </tr>
            ) : (
              results.map(r => {
                const s = studentsMap[r.studentId]
                const hw = homeworksMap[r.homeworkId]
                const studentName = s ? s.name : 'Unknown'
                const studentInitial = studentName.charAt(0).toUpperCase()
                const examTitle = hw ? hw.title : 'Deleted Exam'
                const passed = r.percentage >= 60

                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem', borderRadius: '10px' }}>{studentInitial}</div>
                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.85rem' }}>{studentName}</div>
                      </div>
                    </td>
                    <td>
                       <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{examTitle}</div>
                    </td>
                    <td className="desktop-only text-center">
                      <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                        {r.score} <span style={{ fontWeight: '400', fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {r.totalScore}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${passed ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem', fontWeight: '800' }}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="desktop-only text-right" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .text-center { text-align: center; }
        .text-right { text-align: right; }

        @media (max-width: 1024px) {
          .page-header {
            text-align: center;
          }
        }

        /* Responsive Visibility */
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </div>
  )
}
