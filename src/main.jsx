import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Seed setup
import { isSeeded, markSeeded, setUsers, setHomework, setResults } from './utils/storage'
import { SEED_USERS, SEED_HOMEWORK, SEED_RESULTS } from './data/seed'

if (!isSeeded()) {
  console.log('🌱 Seeding initial data...')
  setUsers(SEED_USERS)
  setHomework(SEED_HOMEWORK)
  setResults(SEED_RESULTS)
  markSeeded()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
