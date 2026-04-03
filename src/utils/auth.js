import { getUsers } from './storage'

export const loginAdmin = (username, password) => {
  const users = getUsers()
  const user = users.find(u => u.role === 'admin' && u.username === username && u.password === password)
  if (user) {
    return { success: true, user: { id: user.id, role: user.role, name: user.name } }
  }
  return { success: false, message: 'Invalid admin credentials' }
}

export const loginStudent = (username, password) => {
  const users = getUsers()
  const user = users.find(u => u.role === 'student' && u.username === username.toLowerCase().trim() && u.password === password)
  if (user) {
    return { success: true, user: { id: user.id, role: user.role, name: user.name } }
  }
  return { success: false, message: 'Invalid student credentials' }
}
