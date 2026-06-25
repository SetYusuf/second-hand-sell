'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './login.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        console.log('✅ Login successful, data:', data)
        
        // Save ALL data to localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userName', data.user.name)
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userRole', data.user.role)
        localStorage.setItem('user', JSON.stringify(data.user))

        console.log('✅ Token saved:', data.token)
        console.log('✅ All localStorage saved')

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/dashboardadmin')
        } else if (data.user.role === 'owner') {
          router.push('/dashboardowner')
        } else {
          router.push('/user-intetface/home')
        }
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        
        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="login-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="links">
          <Link href="/forgot-password">Forgot Password?</Link>
          <Link href="/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  )
}