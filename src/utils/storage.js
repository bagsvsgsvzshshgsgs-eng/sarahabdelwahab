// ─── Storage keys ─────────────────────────────
const KEYS = {
  USERS:    'qp_users',
  HOMEWORK: 'qp_homework',
  RESULTS:  'qp_results',
  SESSION:  'qp_session',
  SEEDED:   'qp_seeded',
}

// Generic helpers
const get = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? null }
  catch { return null }
}
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value))

// ─── Seeding ──────────────────────────────────
export const isSeeded    = () => !!get(KEYS.SEEDED)
export const markSeeded  = () => set(KEYS.SEEDED, true)

// ─── Users ────────────────────────────────────
export const getUsers    = () => get(KEYS.USERS) ?? []
export const setUsers    = (u) => set(KEYS.USERS, u)
export const saveUser    = (user) => {
  const users = getUsers()
  const idx   = users.findIndex(u => u.id === user.id)
  if (idx >= 0) users[idx] = user
  else users.push(user)
  setUsers(users)
}
export const deleteUser  = (id) => setUsers(getUsers().filter(u => u.id !== id))
export const findUser    = (id) => getUsers().find(u => u.id === id) ?? null
export const getStudents = () => getUsers().filter(u => u.role === 'student')

// ─── Homework ─────────────────────────────────
export const getHomework    = () => get(KEYS.HOMEWORK) ?? []
export const setHomework    = (hw) => set(KEYS.HOMEWORK, hw)
export const saveHomework   = (hw) => {
  const list = getHomework()
  const idx  = list.findIndex(h => h.id === hw.id)
  if (idx >= 0) list[idx] = hw
  else list.push(hw)
  setHomework(list)
}
export const deleteHomework = (id) => {
  setHomework(getHomework().filter(h => h.id !== id))
  setResults(getResults().filter(r => r.homeworkId !== id))
}
export const findHomework   = (id) => getHomework().find(h => h.id === id) ?? null
export const getPublished   = () => getHomework().filter(h => h.published)

// ─── Results ──────────────────────────────────
export const getResults     = () => get(KEYS.RESULTS) ?? []
export const setResults     = (r) => set(KEYS.RESULTS, r)
export const saveResult     = (r) => {
  const results = getResults()
  const idx     = results.findIndex(x => x.id === r.id)
  if (idx >= 0) results[idx] = r
  else results.push(r)
  setResults(results)
}
export const getResultsByStudent  = (studentId)  => getResults().filter(r => r.studentId  === studentId)
export const getResultsByHomework = (homeworkId) => getResults().filter(r => r.homeworkId === homeworkId)
export const findResult           = (id)         => getResults().find(r => r.id === id) ?? null
export const studentAlreadySubmitted = (studentId, homeworkId) =>
  getResults().some(r => r.studentId === studentId && r.homeworkId === homeworkId)

// ─── Session ──────────────────────────────────
export const getSession    = () => get(KEYS.SESSION)
export const setSession    = (s) => set(KEYS.SESSION, s)
export const clearSession  = () => localStorage.removeItem(KEYS.SESSION)
