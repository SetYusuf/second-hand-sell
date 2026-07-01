'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredAuthToken } from '@/lib/auth-storage'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = getStoredAuthToken()
    const userRole = sessionStorage.getItem('userRole')
    
    if (token) {
      // User is logged in, redirect based on role
      if (userRole === 'admin') {
        router.push('/dashboardadmin')
      } else if (userRole === 'owner') {
        router.push('/dashboardowner')
      } else {
        router.push('/user-intetface/home')
      }
    } else {
      // No token, redirect to login
      router.push('/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600">Redirecting you to the appropriate page.</p>
      </div>
    </div>
  )
}