import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

// ── Internal email convention ─────────────────────────────
// Students log in with a username. Firebase Auth needs an email.
// We use:  username@sarahapp.edu  as a hidden internal email.
export const toEmail = (username) =>
  `${username.toLowerCase().trim()}@sarahapp.edu`

// ── Student account creation (called by admin) ────────────
export const createStudentAccount = async ({ name, username, password, grade }) => {
  const email = toEmail(username)

  // 1. Create Firebase Auth user
  const userCred = await createUserWithEmailAndPassword(auth, email, password)
  const uid = userCred.user.uid

  // 2. Write Firestore student doc
  await setDoc(doc(db, 'students', uid), {
    uid,
    name,
    username: username.toLowerCase().trim(),
    grade: grade || 'Primary 1',
    role: 'student',
    createdAt: new Date().toISOString(),
    lastLogin: null,
  })

  // 3. Sign back out — admin was briefly "displaced"
  //    The admin will remain logged in because their auth session is still in memory;
  //    createUserWithEmailAndPassword signs in the new user automatically, so we
  //    re-sign in the admin right after. We handle this at the call-site in StudentForm.
  return uid
}

// ── Update student password (called by admin via StudentForm) ─
// Stores a pendingPassword in Firestore; applied on student's next login.
export const setStudentPendingPassword = async (uid, newPassword) => {
  await updateDoc(doc(db, 'students', uid), { pendingPassword: newPassword })
}

// ── Apply pending password (called after student signs in) ───
export const applyPendingPassword = async (firebaseUser, pendingPassword) => {
  try {
    await updatePassword(firebaseUser, pendingPassword)
    await updateDoc(doc(db, 'students', firebaseUser.uid), { pendingPassword: null })
  } catch (e) {
    // Non-fatal — will retry on next login
    console.warn('Could not apply pending password:', e.message)
  }
}

// ── Delete student (Firestore only — Auth delete requires re-auth or Admin SDK) ─
export const deleteStudentFromFirestore = async (uid) => {
  await deleteDoc(doc(db, 'students', uid))
}

// ── Admin bootstrap ──────────────────────────────────────────
// Creates the admin Firebase Auth account + Firestore doc on first login.
export const bootstrapAdmin = async (email, password, name) => {
  let userCred
  try {
    userCred = await createUserWithEmailAndPassword(auth, email, password)
  } catch (e) {
    // Already exists — sign in instead
    userCred = await signInWithEmailAndPassword(auth, email, password)
  }
  const uid = userCred.user.uid
  const snap = await getDoc(doc(db, 'admins', uid))
  if (!snap.exists()) {
    await setDoc(doc(db, 'admins', uid), {
      uid,
      name,
      role: 'admin',
      email,
      createdAt: new Date().toISOString(),
    })
  }
  return { uid, name, role: 'admin' }
}

// ── Student sign-in ──────────────────────────────────────────
export const signInStudent = async (username, password) => {
  const email = toEmail(username)
  const userCred = await signInWithEmailAndPassword(auth, email, password)
  const uid = userCred.user.uid

  // Fetch Firestore profile
  const snap = await getDoc(doc(db, 'students', uid))
  if (!snap.exists()) throw new Error('Student profile not found.')
  const profile = snap.data()

  // Apply pending password if admin reset it
  if (profile.pendingPassword) {
    await applyPendingPassword(userCred.user, profile.pendingPassword)
  }

  // Update last login
  await updateDoc(doc(db, 'students', uid), {
    lastLogin: new Date().toISOString(),
  })

  // Log login event
  await logLoginEvent(uid, profile.name)

  return { uid, id: uid, name: profile.name, username: profile.username, grade: profile.grade, role: 'student' }
}

// ── Admin sign-in ─────────────────────────────────────────────
export const signInAdmin = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password)
  const uid = userCred.user.uid

  const snap = await getDoc(doc(db, 'admins', uid))
  let profile
  if (!snap.exists()) {
    // Auto-heal: auth account exists but Firestore doc is missing
    profile = {
      uid,
      name: email.split('@')[0],
      role: 'admin',
      email,
      createdAt: new Date().toISOString()
    }
    await setDoc(doc(db, 'admins', uid), profile)
  } else {
    profile = snap.data()
  }

  await logLoginEvent(uid, profile.name)
  return { uid, id: uid, name: profile.name, role: 'admin', email: profile.email }
}

// ── Sign out ──────────────────────────────────────────────────
export const firebaseSignOut = async () => {
  await signOut(auth)
}

// ── Login event logger ────────────────────────────────────────
export const logLoginEvent = async (uid, name) => {
  try {
    await addDoc(collection(db, 'loginLogs'), {
      uid,
      name,
      timestamp: serverTimestamp(),
      device: navigator.userAgent,
    })
  } catch (e) {
    console.warn('Login log failed:', e.message)
  }
}
