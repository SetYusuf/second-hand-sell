'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { getStoredAuthToken, getStoredUserId } from '@/lib/auth-storage'

interface SocketContextValue {
  socket: Socket | null
  unreadCount: number
  setUnreadCount: (count: number) => void
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  unreadCount: 0,
  setUnreadCount: () => {},
})

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const userId = getStoredUserId()
    if (!userId) return

    const socketInstance = io({
      path: '/socket.io',
      transports: ['websocket'],
    })
    setSocket(socketInstance)

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

    socketInstance.on('connect', () => {
      socketInstance.emit('join', userId)
      refreshUnreadCount()
    })

    socketInstance.on('unread_count', (payload: { count: number }) => {
      setUnreadCount(payload.count)
    })

    socketInstance.on('conversation_read', () => {
      refreshUnreadCount()
    })

    socketInstance.on('new_message', () => {
      refreshUnreadCount()
    })

    refreshUnreadCount()

    return () => {
      socketInstance.emit('leave', userId)
      socketInstance.disconnect()
      setSocket(null)
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
