/**
 * auth.js — thin wrappers used by login pages.
 * All heavy lifting is in firebaseAuth.js.
 */
import { signInAdmin, signInStudent, bootstrapAdmin } from './firebaseAuth'

// Admin login — first-time auto-creates the Firebase Auth account
export const loginAdmin = async (username, password) => {
  try {
    // Admin email is stored as username@sarahapp.edu for consistency.
    // Handles spaces: e.g. "sarah abdelwahab" -> "sarahabdelwahab@sarahapp.edu"
    const isEmail = username.includes('@')
    const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, '')
    const email = isEmail ? username : `${cleanUsername}@sarahapp.edu`

    let user
    try {
      user = await signInAdmin(email, password)
    } catch (e) {
      // If admin profile doesn't exist yet, bootstrap it (first run).
      // Newer Firebase projects use 'auth/invalid-credential' instead of 'auth/user-not-found'
      if (e.message === 'Admin profile not found.' || e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
        try {
          const defaultNames = ['sarahabdelwahab', 'admin', 'kamel']
          const displayName = defaultNames.includes(cleanUsername) ? 'Sarah Abdelwahab' : username
          user = await bootstrapAdmin(email, password, displayName)
          user.role = 'admin'
        } catch (bootstrapErr) {
          if (bootstrapErr.code === 'auth/email-already-in-use') {
            // It was actually just a wrong password for an existing account
            throw e 
          }
          throw bootstrapErr
        }
      } else {
        throw e
      }
    }
    return { success: true, user }
  } catch (err) {
    const msg = mapFirebaseError(err)
    return { success: false, message: msg }
  }
}

// Student login — username is converted to internal @sarahapp.edu email
export const loginStudent = async (username, password) => {
  try {
    const user = await signInStudent(username, password)
    return { success: true, user }
  } catch (err) {
    const msg = mapFirebaseError(err)
    return { success: false, message: msg }
  }
}

// Map Firebase Auth error codes to friendly messages
const mapFirebaseError = (err) => {
  switch (err.code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid username or password. Please try again.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.'
    case 'auth/invalid-email':
      return 'Invalid username format.'
    default:
      return err.message || 'An authentication error occurred.'
  }
}
