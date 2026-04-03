/**
 * storage.js — All data access goes through Firestore.
 * No localStorage fallback. Firebase is required.
 *
 * Collections:
 *   students    — student profiles (document ID = Firebase Auth UID)
 *   admins      — admin profiles   (document ID = Firebase Auth UID)
 *   homeworks   — homework/quiz docs
 *   submissions — quiz submissions (was: results)
 */

import { db } from '../firebase'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

// ── Generic helpers ────────────────────────────────────────

const getAll = async (collectionName) => {
  const snap = await getDocs(collection(db, collectionName))
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

const saveOne = async (collectionName, data) => {
  await setDoc(doc(db, collectionName, data.id), data)
}

const deleteOne = async (collectionName, id) => {
  await deleteDoc(doc(db, collectionName, id))
}

// ── Students ──────────────────────────────────────────────

export const getStudents = async () => {
  const snap = await getDocs(
    query(collection(db, 'students'), where('role', '==', 'student'))
  )
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export const findUser = async (uid) => {
  // Check students
  let snap = await getDoc(doc(db, 'students', uid))
  if (snap.exists()) return { ...snap.data(), id: snap.id }
  // Check admins
  snap = await getDoc(doc(db, 'admins', uid))
  if (snap.exists()) return { ...snap.data(), id: snap.id }
  return null
}

export const saveUser = async (userData) => {
  const col = userData.role === 'admin' ? 'admins' : 'students'
  const { id, ...data } = userData
  await setDoc(doc(db, col, id), data, { merge: true })
}

export const deleteUser = async (uid) => {
  // Delete Firestore doc (Firebase Auth user remains but can't log in meaningfully)
  await deleteDoc(doc(db, 'students', uid))
}

export const getUsers = async () => {
  const [students, admins] = await Promise.all([
    getAll('students'),
    getAll('admins'),
  ])
  return [...students, ...admins]
}

// ── Homework ──────────────────────────────────────────────

export const getHomework = async () => getAll('homeworks')

export const saveHomework = async (hw) => {
  await setDoc(doc(db, 'homeworks', hw.id), hw)
}

export const deleteHomework = async (id) => {
  await deleteOne('homeworks', id)
  // Delete associated submissions
  const subs = await getSubmissionsByHomework(id)
  for (const s of subs) {
    await deleteDoc(doc(db, 'submissions', s.id))
  }
}

export const findHomework = async (id) => {
  const snap = await getDoc(doc(db, 'homeworks', id))
  return snap.exists() ? { ...snap.data(), id: snap.id } : null
}

export const getPublished = async () => {
  const snap = await getDocs(
    query(collection(db, 'homeworks'), where('published', '==', true))
  )
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export const setHomework = async (homeworks) => {
  for (const hw of homeworks) await saveHomework(hw)
}

export const setUsers = async (users) => {
  for (const u of users) await saveUser(u)
}

// ── Submissions (formerly "results") ─────────────────────

export const getResults = async () => getSubmissions()

export const getSubmissions = async () => getAll('submissions')

export const saveResult = async (result) => {
  // result.id may be pre-generated; use it as doc ID
  const { id, ...data } = result
  if (id) {
    await setDoc(doc(db, 'submissions', id), data)
  } else {
    await addDoc(collection(db, 'submissions'), data)
  }
}

export const saveSubmission = saveResult

export const getResultsByStudent = async (studentId) => {
  const snap = await getDocs(
    query(collection(db, 'submissions'), where('studentId', '==', studentId))
  )
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export const getSubmissionsByStudent = getResultsByStudent

export const getResultsByHomework = async (homeworkId) => {
  const snap = await getDocs(
    query(collection(db, 'submissions'), where('homeworkId', '==', homeworkId))
  )
  return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export const getSubmissionsByHomework = getResultsByHomework

export const findResult = async (id) => {
  const snap = await getDoc(doc(db, 'submissions', id))
  return snap.exists() ? { ...snap.data(), id: snap.id } : null
}

// ── Seeding (no-op; seed data is managed in Firebase Console) ─

export const isSeeded = () => true
export const markSeeded = () => {}
