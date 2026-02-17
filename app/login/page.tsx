'use client'

import './login.css'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '../contexts/ThemeContext'

export default function LoginPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password })
    // Save user email to localStorage for profile page
    localStorage.setItem('userEmail', email);
    // Redirect to user interface home page
    router.push('/user-intetface/home')
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p className="subtitle">Buy & Sell Second-hand</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <p className="forgot-text">
          <Link href="/forgot-password">Forgot password?</Link>
        </p>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="register-text">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}
