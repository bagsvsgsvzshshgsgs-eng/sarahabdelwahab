import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { findResult, findHomework } from '../../utils/storage'

export const StudentResultPage = () => {
  const { resultId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [homework, setHomework] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const res = await findResult(resultId)
      
      if (res) {
        setResult(res)
        const hw = await findHomework(res.homeworkId)
        setHomework(hw)
      } else {
        navigate('/student/home')
      }
      setLoading(false)
    })()
  }, [resultId, navigate])

  if (loading || !result || !homework) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', borderRadius: '15px' }}>📈</div>
        <p style={{ fontWeight: '800', color: 'var(--primary)' }}>GENERATING PERFORMANCE REPORT...</p>
      </div>
    )
  }

  const passed = result.percentage >= 60
  
  // Calculate correct vs wrong
  const totalQuestions = homework.questions?.length || 0
  let correctCount = 0
  if (homework.questions) {
    homework.questions.forEach(q => {
      if (result.answers && result.answers[q.id] === q.correct) {
        correctCount++
      }
    })
  }
  const wrongCount = totalQuestions - correctCount

  const correctPercent = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0
  const wrongPercent = totalQuestions > 0 ? (wrongCount / totalQuestions) * 100 : 0

  return (
    <div className="result-page fade-in">
      <div className="page-header result-header">
        <div className="page-header-text">
          <div className="badge badge-neutral result-badge" style={{ letterSpacing: '0.1em' }}>EXAMINATION COMPLETED</div>
          <h1 className="result-main-title">Academic Review</h1>
          <p className="result-subtitle">{homework.title}</p>
        </div>
      </div>

      <div className="scorecard-container">
        
        <div className="card score-hero-card">
           {/* Sophisticated Score Visualization */}
           <div className="score-viz-wrapper">
              <svg viewBox="0 0 220 220" className="score-svg">
                 <circle cx="110" cy="110" r="100" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                 <circle cx="110" cy="110" r="100" fill="none" 
                    stroke={passed ? 'var(--success)' : 'var(--danger)'} 
                    strokeWidth="12" 
                    strokeDasharray="628" 
                    strokeDashoffset={628 - (628 * result.percentage / 100)}
                    strokeLinecap="round"
                    className="score-circle-fill"
                 />
              </svg>
              <div className="score-text-overlay">
                 <div className="score-percent">{result.percentage}%</div>
                 <div className="score-label">FINAL SCORE</div>
              </div>
           </div>

           <h2 className="score-feedback-text">
             {passed ? 'Exceptional Result!' : 'Valuable Effort'}
           </h2>
           <p className="score-description">
             You successfully secured <strong>{result.score} XP</strong> out of <strong>{result.totalScore} XP</strong>. 
             Review your answers to sharpen your knowledge.
           </p>

           <div className="score-stats-grid">
              <div className="stat-box success-stat">
                 <div className="stat-number">{correctCount}</div>
                 <div className="stat-label">CORRECT</div>
              </div>
              <div className="stat-box danger-stat">
                 <div className="stat-number">{wrongCount}</div>
                 <div className="stat-label">INCORRECT</div>
              </div>
           </div>
        </div>

        <div className="analysis-section">
           <h3 className="section-title">
             <span>Detailed Analysis</span>
             <div className="title-divider"></div>
           </h3>
           
           <div className="questions-analysis-list">
             {homework.questions?.map((q, index) => {
               const studentAnswer = result.answers?.[q.id]
               const isCorrect = studentAnswer === q.correct
               const choiceLetters = ['A', 'B', 'C', 'D']

               return (
                 <div key={q.id} className="card question-analysis-card">
                   <div className="question-analysis-header">
                     <div className={`status-indicator ${isCorrect ? 'correct' : 'wrong'}`}>
                       {isCorrect ? '✓' : '✗'}
                     </div>
                     <div className="question-info">
                        <div className="question-meta">QUESTION {index + 1}</div>
                        <div className="question-text-small">
                          {q.text}
                        </div>
                     </div>
                   </div>

                   <div className="analysis-choices-grid">
                     {choiceLetters.map((letter, cIndex) => {
                       const choiceText = q.choices[cIndex]
                       const isStudentChoice = studentAnswer === letter
                       const isCorrectChoice = q.correct === letter
                       
                       let statusClass = ''
                       if (isCorrectChoice) statusClass = 'choice-correct'
                       else if (isStudentChoice && !isCorrect) statusClass = 'choice-wrong'

                       return (
                         <div key={letter} className={`analysis-choice-item ${statusClass}`}>
                           <div className={`analysis-letter-box ${statusClass}`}>
                             {letter}
                           </div>
                           <span className="analysis-choice-text">{choiceText}</span>
                           {isCorrectChoice && <span className="status-emoji">✅</span>}
                           {isStudentChoice && !isCorrect && <span className="status-emoji">❌</span>}
                         </div>
                       )
                     })}
                   </div>

                   {!isCorrect && (
                     <div className="learning-note-box">
                        <div className="note-label">LEARNING NOTE</div>
                        <div className="note-content">
                          The correct selection was <strong>({q.correct})</strong>. Review the relevant study material to improve.
                        </div>
                     </div>
                   )}
                 </div>
               )
             })}
           </div>
        </div>

        <div className="result-actions">
          <Link to="/student/home" className="btn btn-outline action-btn">
            Dashboard
          </Link>
          <button onClick={() => window.print()} className="btn btn-primary action-btn">
            Save PDF
          </button>
        </div>
      </div>

      <style>{`
        .result-page {
          padding-bottom: 80px;
        }

        .result-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .result-main-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin: 12px 0 4px;
        }

        .result-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        .result-badge {
          margin-bottom: 12px !important;
        }

        .scorecard-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .score-hero-card {
          padding: 40px;
          text-align: center;
          margin-bottom: 48px;
        }

        .score-viz-wrapper {
          position: relative;
          width: 180px;
          height: 180px;
          margin: 0 auto 32px;
        }

        .score-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .score-circle-fill {
          transition: stroke-dashoffset 1s ease-out;
        }

        .score-text-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          display: flex; flexDirection: column;
          align-items: center; justifyContent: center;
        }

        .score-percent {
          font-size: 3rem;
          font-weight: 900;
          color: var(--primary);
          line-height: 1;
        }

        .score-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          margin-top: 4px;
        }

        .score-feedback-text {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .score-description {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .score-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          max-width: 400px;
          margin: 0 auto;
        }

        .stat-box {
          padding: 16px;
          border-radius: 16px;
        }

        .success-stat { background: var(--success-light); color: var(--success); }
        .danger-stat { background: var(--danger-light); color: var(--danger); }

        .stat-number { font-size: 1.25rem; font-weight: 900; }
        .stat-label { font-size: 0.65rem; font-weight: 800; }

        .analysis-section { margin-bottom: 40px; }

        .section-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .title-divider { flex: 1; height: 1px; background: var(--border-light); }

        .question-analysis-card {
          padding: 32px;
          margin-bottom: 20px;
        }

        .question-analysis-header {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }

        .status-indicator {
          width: 36px; height: 36px;
          border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 800;
        }

        .status-indicator.correct { background: var(--success); }
        .status-indicator.wrong { background: var(--danger); }

        .question-meta { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px; }
        .question-text-small { font-size: 1.1rem; font-weight: 700; color: var(--primary); line-height: 1.4; }

        .analysis-choices-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .analysis-choice-item {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          display: flex; align-items: center; gap: 12px;
          font-size: 0.9rem; font-weight: 700;
        }

        .analysis-choice-item.choice-correct { border-color: var(--success); background: var(--success-light); color: #065f46; }
        .analysis-choice-item.choice-wrong { border-color: var(--danger); background: var(--danger-light); color: #b91c1c; }

        .analysis-letter-box {
          width: 28px; height: 28px; border-radius: 8px;
          background: #f1f5f9; color: var(--text-muted);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; flex-shrink: 0;
        }

        .analysis-letter-box.choice-correct { background: var(--success); color: white; }
        .analysis-letter-box.choice-wrong { background: var(--danger); color: white; }

        .status-emoji { margin-left: auto; font-size: 0.9rem; }

        .learning-note-box {
          margin-top: 24px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 4px solid var(--accent);
        }

        .note-label { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px; }
        .note-content { font-size: 0.85rem; color: var(--text-main); line-height: 1.5; }

        .result-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 40px;
        }

        .action-btn { height: 52px; flex: 1; max-width: 200px; border-radius: 12px; font-weight: 800; }

        @media (max-width: 1024px) {
          .result-main-title { font-size: 1.75rem; }
          .result-header { margin-bottom: 24px; }
          .score-hero-card { padding: 24px; }
          .question-analysis-card { padding: 20px; }
          .question-text-small { font-size: 1rem; }
          .result-actions { flex-direction: column; align-items: stretch; }
          .action-btn { max-width: none; }
        }
      `}</style>
    </div>
  )
}
