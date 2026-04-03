import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { findHomework, saveResult } from '../../utils/storage'

export const QuizPage = () => {
  const { homeworkId } = useParams()
  const { user } = useAppContext()
  const navigate = useNavigate()

  const [homework, setHomework] = useState(null)
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const hw = await findHomework(homeworkId)
      if (hw) {
        setHomework(hw)
      } else {
        navigate('/student/home')
      }
      setLoading(false)
    })()
  }, [homeworkId, navigate])

  if (loading || !homework) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '20px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', borderRadius: '15px', animation: 'pulse 1.5s infinite' }}>📚</div>
        <p style={{ fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>PREPARING ASSESSMENT...</p>
        <style>{`@keyframes pulse { 0%,100% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 1; } }`}</style>
      </div>
    )
  }

  const questionsCount  = homework.questions?.length || 0
  const answeredCount   = Object.keys(answers).length
  const progressPercent = questionsCount > 0 ? (answeredCount / questionsCount) * 100 : 0

  const handleSelect = (qId, choiceLetter) => {
    setAnswers({ ...answers, [qId]: choiceLetter })
    setError('')
  }

  const handleSubmit = async () => {
    if (answeredCount < questionsCount) {
      setError('Please answer all questions before submitting.')
      return
    }
    if (!window.confirm('Are you ready to submit your exam? You cannot change your answers later.')) return

    setLoading(true)

    let score = 0
    let totalScore = 0
    let correctAnswers = 0
    let wrongAnswers = 0

    homework.questions.forEach(q => {
      const points = parseInt(q.score, 10) || 0
      totalScore += points
      if (answers[q.id] === q.correct) {
        score += points
        correctAnswers++
      } else {
        wrongAnswers++
      }
    })

    const percentage = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0
    const resultId = `res-${Date.now()}`

    const resultObj = {
      id: resultId,
      studentId: user.id,
      studentName: user.name,
      homeworkId: homework.id,
      homeworkTitle: homework.title,
      answers,
      score,
      totalScore,
      correctAnswers,
      wrongAnswers,
      percentage,
      submittedAt: new Date().toISOString(),
    }

    await saveResult(resultObj)
    navigate(`/student/result/${resultId}`)
  }

  const choiceLetters = ['A', 'B', 'C', 'D']

  return (
    <div className="quiz-page fade-in">
      {/* Fixed Top Bar */}
      <nav className="quiz-topbar">
        <div className="topbar-left-section">
          <Link to="/student/home" className="btn btn-outline btn-exit desktop-only">
            <span>←</span> Exit
          </Link>
          <Link to="/student/home" className="mobile-only btn-exit-mobile">✕</Link>
          <div className="divider desktop-only"></div>
          <div className="quiz-title-box">
            <h2 className="quiz-title-text">{homework.title}</h2>
            <p className="quiz-status-text">ASSESSMENT IN PROGRESS</p>
          </div>
        </div>

        <div className="quiz-progress-section">
          <div className="progress-info">
            <span className="progress-label">PROGRESS</span>
            <span className="progress-count">{answeredCount}/{questionsCount}</span>
          </div>
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="topbar-right-section desktop-only">
          <div className="user-profile-mini">
            <div className="user-info-mini">
              <div className="user-name-mini">{user?.name}</div>
              <div className="user-status-mini">● ONLINE</div>
            </div>
            <div className="avatar-mini">{user?.name?.charAt(0).toUpperCase()}</div>
          </div>
        </div>
      </nav>

      {/* Scrollable Content */}
      <div className="quiz-main-container">
        <div className="instruction-card">
          <h1>Instructions</h1>
          <p>{homework.description || 'Answer all questions carefully. You must complete the entire assessment to submit.'}</p>
        </div>

        {homework.questions?.map((q, index) => (
          <div key={q.id} className="question-card">
            <div className="question-header">
              <span className="question-number">{index + 1}</span>
              <div className="badge badge-warning score-badge">{q.score} pts</div>
            </div>

            <h2 className="question-text">{q.text}</h2>

            <div className="choices-list">
              {choiceLetters.map((letter, cIndex) => {
                const choiceText = q.choices[cIndex]
                const isSelected = answers[q.id] === letter
                return (
                  <div
                    key={letter}
                    className={`choice-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(q.id, letter)}
                  >
                    <div className="choice-indicator">{letter}</div>
                    <span className="choice-content">{choiceText}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="quiz-footer">
        <div className="footer-status desktop-only">
          {error ? (
            <div className="status-error"><span>⚠️</span> {error}</div>
          ) : (
            <div className="status-save"><span>☁️</span> Answers auto-saved to cloud</div>
          )}
        </div>

        <button
          className={`btn btn-primary submit-btn ${answeredCount < questionsCount ? 'incomplete' : ''}`}
          onClick={handleSubmit}
          disabled={answeredCount === 0 || loading}
        >
          {loading
            ? 'Submitting...'
            : answeredCount < questionsCount
            ? `${questionsCount - answeredCount} Question${questionsCount - answeredCount !== 1 ? 's' : ''} Remaining`
            : 'Submit Final Results'}
        </button>
      </div>

      <style>{`
        .quiz-page { background: var(--bg-app); min-height: 100vh; display: flex; flex-direction: column; }

        .quiz-topbar {
          position: fixed; top: 0; left: 0; right: 0; height: 80px;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; z-index: 100;
        }

        .topbar-left-section { display: flex; align-items: center; gap: 20px; flex: 1; }
        .divider { width: 1px; height: 32px; background: var(--border-light); }

        .quiz-title-text { font-size: 0.95rem; font-weight: 800; color: var(--primary); margin: 0; }
        .quiz-status-text { font-size: 0.65rem; color: var(--text-light); font-weight: 700; margin: 0; }

        .quiz-progress-section { flex: 2; max-width: 500px; margin: 0 24px; }
        .progress-info { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.75rem; font-weight: 800; }
        .progress-label { color: var(--accent); }

        .quiz-progress-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .quiz-progress-fill { height: 100%; background: var(--accent); box-shadow: 0 0 10px rgba(37,99,235,0.3); transition: width 0.4s ease; }

        .topbar-right-section { flex: 1; display: flex; justify-content: flex-end; }
        .user-profile-mini { display: flex; align-items: center; gap: 12px; }
        .user-info-mini { text-align: right; }
        .user-name-mini { font-size: 0.85rem; font-weight: 800; }
        .user-status-mini { font-size: 0.65rem; color: var(--success); font-weight: 700; }
        .avatar-mini { width: 36px; height: 36px; border-radius: 10px; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; }

        .quiz-main-container { max-width: 800px; width: 100%; margin: 0 auto; padding: 120px 20px 140px; }

        .instruction-card { background: white; padding: 32px; border-radius: 20px; border: 1px solid var(--border-light); margin-bottom: 40px; box-shadow: var(--shadow-sm); }
        .instruction-card h1 { font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 12px; }
        .instruction-card p  { color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; }

        .question-card { background: white; padding: 40px; border-radius: 24px; border: 1px solid var(--border-light); margin-bottom: 32px; box-shadow: var(--shadow-sm); }
        .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .question-number { width: 44px; height: 44px; background: var(--primary); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; }
        .question-text { font-size: 1.25rem; font-weight: 700; color: var(--primary); line-height: 1.5; margin-bottom: 32px; }

        .choices-list { display: grid; grid-template-columns: 1fr; gap: 12px; }

        .choice-item { display: flex; align-items: center; gap: 16px; padding: 18px 24px; background: white; border: 2px solid var(--border-light); border-radius: 16px; cursor: pointer; transition: var(--transition); }
        .choice-item:hover { background: var(--bg-hover); }
        .choice-item.selected { background: var(--accent-light); border-color: var(--accent); }

        .choice-indicator { width: 32px; height: 32px; border-radius: 8px; background: #f1f5f9; color: var(--text-muted); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; transition: var(--transition); }
        .choice-item.selected .choice-indicator { background: var(--accent); color: white; }

        .choice-content { font-size: 1rem; font-weight: 700; color: var(--text-main); }
        .choice-item.selected .choice-content { color: var(--accent); }

        .quiz-footer { position: fixed; bottom: 0; left: 0; right: 0; height: 100px; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-top: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; z-index: 100; }

        .status-error { color: var(--danger); font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .status-save  { color: var(--text-muted); font-weight: 700; opacity: 0.8; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }

        .submit-btn { height: 56px; padding: 0 40px; font-size: 1rem; font-weight: 800; border-radius: 16px; }
        .submit-btn.incomplete { opacity: 0.7; background: var(--text-light); border: none; }

        @media (max-width: 1024px) {
          .quiz-topbar { padding: 0 16px; height: 72px; }
          .quiz-progress-section { margin: 0 12px; }
          .quiz-main-container { padding: 92px 16px 120px; }
          .question-card { padding: 24px; border-radius: 20px; }
          .question-text { font-size: 1.15rem; margin-bottom: 24px; }
          .choice-item { padding: 14px 16px; gap: 12px; }
          .quiz-footer { padding: 0 16px; height: 88px; }
          .submit-btn { width: 100%; }
          .btn-exit-mobile { font-size: 1.25rem; color: var(--text-muted); text-decoration: none; padding: 8px; }
        }
      `}</style>
    </div>
  )
}
