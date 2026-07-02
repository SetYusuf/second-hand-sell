'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage'

interface SocketContextValue {
  unreadCount: number
  setUnreadCount: (count: number) => void
}

const SocketContext = createContext<SocketContextValue>({
  unreadCount: 0,
  setUnreadCount: () => {},
})

export function SocketProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const unreadCountIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Poll unread message count every 10-15 seconds
  useEffect(() => {
    const userId = getStoredUserId()
    if (!userId) return

    const refreshUnreadCount = async () => {
      try {
        const token = getStoredAuthToken()
        if (!token) return

        const res = await fetch('/api/messages/unread-count', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setUnreadCount(data.count)
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    }

    // Initial fetch
    refreshUnreadCount()

    // Poll every 12 seconds
    unreadCountIntervalRef.current = setInterval(refreshUnreadCount, 12000)

    return () => {
      if (unreadCountIntervalRef.current) {
        clearInterval(unreadCountIntervalRef.current)
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}

