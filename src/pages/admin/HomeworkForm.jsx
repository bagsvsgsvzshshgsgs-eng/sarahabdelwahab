import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { findHomework, saveHomework } from '../../utils/storage'

export const HomeworkForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ title: '', description: '', published: false, grade: 'All' })
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      if (isEditing) {
        const hw = await findHomework(id)
        if (hw) {
          setFormData({ title: hw.title, description: hw.description, published: hw.published, grade: hw.targetGrade || 'All' })
          setQuestions(hw.questions || [])
        } else {
          navigate('/admin/homework')
        }
      } else {
        addQuestion()
      }
      setLoading(false)
    })()
  }, [id, navigate, isEditing])

  const addQuestion = () => {
    setQuestions([...questions, {
      id: `q-${Date.now()}-${Math.random()}`,
      text: '', choices: ['', '', '', ''], correct: 'A', score: 10
    }])
  }

  const removeQuestion = (index) => {
    const q = [...questions]
    q.splice(index, 1)
    setQuestions(q)
  }

  const updateQuestion = (index, field, value) => {
    const q = [...questions]
    q[index][field] = value
    setQuestions(q)
  }

  const updateChoice = (qIndex, cIndex, value) => {
    const q = [...questions]
    q[qIndex].choices[cIndex] = value
    setQuestions(q)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title) return setError('Title is required.')
    if (questions.length === 0) return setError('Add at least one question.')

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (!q.text) return setError(`Question ${i + 1} text is required.`)
      if (q.choices.some(c => !c)) return setError(`All 4 choices for Q${i + 1} are required.`)
    }

    setLoading(true)
    const existingHw = isEditing ? await findHomework(id) : null
    
    const hw = {
      id: isEditing ? id : `hw-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      targetGrade: formData.grade || 'All',
      published: formData.published,
      createdAt: isEditing ? existingHw?.createdAt : new Date().toISOString(),
      questions
    }

    await saveHomework(hw)
    navigate('/admin/homework')
  }

  return (
    <div className="form-page-container">
      <div className="page-header form-header">
        <div className="page-header-text">
          <Link to="/admin/homework" className="back-link">
            ← Back to Exams
          </Link>
          <h1>{isEditing ? 'Edit Exam' : 'Create Exam'}</h1>
          <p>Configure the exam details and add questions below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="exam-form">
        <div className="card details-card">
          <h2 className="section-title-small">General Details</h2>
          <div className="form-group">
            <label className="form-label">Exam Title</label>
            <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Science Chapter 1 Quiz" />
          </div>
          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea className="form-input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Instructions for students" rows={3} style={{ resize: 'vertical' }} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Target Grade Level</label>
            <select className="form-input select-input" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })}>
              <option value="All">All Students</option>
              <option value="Primary 1">Primary 1</option>
              <option value="Primary 2">Primary 2</option>
              <option value="Primary 3">Primary 3</option>
              <option value="Primary 4">Primary 4</option>
              <option value="Primary 5">Primary 5</option>
              <option value="Primary 6">Primary 6</option>
              <option value="Secondary 1">Secondary 1</option>
              <option value="Secondary 2">Secondary 2</option>
              <option value="Secondary 3">Secondary 3</option>
            </select>
          </div>

          <label className="publish-toggle">
            <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} className="toggle-input" />
            <div className="toggle-content">
              <div className="toggle-label">Publish Exam</div>
              <div className="toggle-sub">Make it immediately available to all students.</div>
            </div>
          </label>
        </div>

        <div className="questions-section-header">
          <h2 className="section-title">Questions</h2>
          <span className="badge badge-neutral">{questions.length} Total</span>
        </div>
        
        {questions.map((q, qIndex) => (
          <div key={q.id} className="card question-edit-card">
            <div className="question-header-row">
              <strong className="question-identity">
                <span className="q-num">{qIndex + 1}</span> Question
              </strong>
              <button type="button" onClick={() => removeQuestion(qIndex)} className="btn btn-danger-ghost remove-btn">🗑️ Remove</button>
            </div>

            <div className="form-group">
              <label className="form-label">Question Text</label>
              <input type="text" className="form-input" value={q.text} onChange={e => updateQuestion(qIndex, 'text', e.target.value)} placeholder="Type the question here..." />
            </div>

            <div className="choices-grid">
              {['A', 'B', 'C', 'D'].map((label, cIndex) => (
                <div key={label} className="choice-input-group">
                  <label className="form-label">Choice {label}</label>
                  <input type="text" className="form-input" value={q.choices[cIndex]} onChange={e => updateChoice(qIndex, cIndex, e.target.value)} />
                </div>
              ))}
            </div>

            <div className="scoring-config-row">
              <div className="form-group config-item">
                <label className="form-label">Correct Answer</label>
                <select className="form-input select-input" value={q.correct} onChange={e => updateQuestion(qIndex, 'correct', e.target.value)}>
                  <option value="A">Choice A</option>
                  <option value="B">Choice B</option>
                  <option value="C">Choice C</option>
                  <option value="D">Choice D</option>
                </select>
              </div>
              <div className="form-group config-item points-item">
                <label className="form-label">Points</label>
                <input type="number" className="form-input" value={q.score} onChange={e => updateQuestion(qIndex, 'score', e.target.value)} min="1" />
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="btn add-q-btn">
          + Add another question
        </button>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <div className="form-actions-row">
           <button type="submit" className="btn btn-primary submit-btn">{isEditing ? 'Save Exam' : 'Create Exam'}</button>
           <Link to="/admin/homework" className="btn btn-outline cancel-btn">Cancel</Link>
        </div>
      </form>

      <style>{`
        .form-page-container {
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 80px;
        }

        .back-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
        }

        .section-title-small {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--primary);
        }

        .publish-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          margin-top: 16px;
          padding: 16px;
          background: var(--bg-app);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .toggle-input {
          width: 20px;
          height: 20px;
          accent-color: var(--accent);
        }

        .toggle-label { font-weight: 700; color: var(--text-main); }
        .toggle-sub { font-size: 0.75rem; color: var(--text-muted); }

        .questions-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 48px 0 24px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        .question-edit-card {
          padding: 32px;
          margin-bottom: 24px;
          background: white;
          border: 1px solid var(--border-light);
        }

        .question-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .question-identity {
          font-size: 1.1rem;
          color: var(--primary);
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
        }

        .choices-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .scoring-config-row {
          display: flex;
          gap: 24px;
          padding: 24px;
          background: var(--bg-app);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .config-item { flex: 1; margin-bottom: 0 !important; }
        .points-item { max-width: 150px; }

        .add-q-btn {
          width: 100%;
          padding: 20px;
          border: 2px dashed var(--border-light);
          background: transparent;
          color: var(--text-muted);
          font-weight: 700;
          margin-bottom: 40px;
          border-radius: 16px;
        }

        .form-actions-row {
          display: flex;
          flex-direction: row-reverse;
          gap: 16px;
          margin-top: 40px;
        }

        .submit-btn, .cancel-btn {
          height: 52px;
          padding: 0 32px;
          font-weight: 800;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }

        .submit-btn { flex: 2; }
        .cancel-btn { flex: 1; text-decoration: none; }

        @media (max-width: 768px) {
          .choices-grid { grid-template-columns: 1fr; }
          .scoring-config-row { flex-direction: column; gap: 16px; }
          .points-item { max-width: none; }
          .question-edit-card { padding: 20px; }
          .form-actions-row { flex-direction: column; }
          .submit-btn, .cancel-btn { width: 100%; }
          .form-header { text-align: center; }
        }
      `}</style>
    </div>
  )
}
