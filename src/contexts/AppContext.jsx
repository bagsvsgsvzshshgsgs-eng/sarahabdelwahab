import React, { createContext, useContext, useState, useEffect } from 'react'
import { getSession, setSession as saveSession, clearSession } from '../utils/storage'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session)
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    saveSession(userData)
    setUser(userData)
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  return (
    <AppContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
