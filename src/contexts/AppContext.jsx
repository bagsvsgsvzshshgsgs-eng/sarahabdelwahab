import React, { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { firebaseSignOut } from '../utils/firebaseAuth'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Firebase listener — fires on every device, every page load
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        // Try students collection first
        let snap = await getDoc(doc(db, 'students', firebaseUser.uid))
        if (snap.exists()) {
          const data = snap.data()
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: data.name,
            username: data.username,
            grade: data.grade,
            role: 'student',
          })
          setLoading(false)
          return
        }

        // Try admins collection
        snap = await getDoc(doc(db, 'admins', firebaseUser.uid))
        if (snap.exists()) {
          const data = snap.data()
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: data.name,
            role: 'admin',
            email: data.email,
          })
          setLoading(false)
          return
        }

        // Signed-in user has no Firestore profile — sign out
        await firebaseSignOut()
        setUser(null)
      } catch (err) {
        console.error('AppContext: error resolving user profile', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // login() is called after Firebase signIn to immediately update context
  // (onAuthStateChanged will also fire, but this makes UI respond instantly)
  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    await firebaseSignOut()
    setUser(null)
  }

  return (
    <AppContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
