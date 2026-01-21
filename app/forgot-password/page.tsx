'use client'

import './forgot.css'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email })
    alert('Reset link sent (backend later)')
  }

  return (
    <div className="forgot-container">
      <form className="forgot-box" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p className="subtitle">Enter your email to reset your password</p>

        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>

        <p className="back-login-text">
          <Link href="/login">Back to Login</Link>
        </p>
      </form>
    </div>
  )
}
