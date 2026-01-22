'use client'

import './login.css'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password })
    // Redirect to user interface home page
    router.push('/user-intetface/home')
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p className="subtitle">Buy & Sell Second-hand</p>

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="forgot-text">
          <Link href="/forgot-password">Forgot password?</Link>
        </p>

        <button type="submit">Login</button>

        <p className="register-text">
          Don’t have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}
