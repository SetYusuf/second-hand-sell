'use client'

import './forgot.css'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // ============ STEP 1: REQUEST RESET ============
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!email.trim()) {
        throw new Error('Email is required')
      }

      console.log('📧 Requesting password reset...')

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      console.log('✅ Reset request sent')

      setSuccess(
        '✅ If an account with that email exists, a reset link has been sent. Check your email!'
      )
      setSubmitted(true)

      // In development, show the token input (for testing)
      if (process.env.NODE_ENV === 'development' && data.testToken) {
        console.log('🔑 Test Token:', data.testToken)
        setShowResetForm(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ============ STEP 2: RESET PASSWORD ============
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!resetToken.trim()) {
        throw new Error('Reset token is required')
      }
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      console.log('🔐 Resetting password...')

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken.trim(),
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Reset failed')
      }

      console.log('✅ Password reset successfully')

      setSuccess('✅ Password reset successfully! Redirecting to login...')
      setEmail('')
      setResetToken('')
      setNewPassword('')
      setConfirmPassword('')
      setShowResetForm(false)

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        {/* Brand Logo */}
        <div className="forgot-brand">
          <div className="forgot-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Reset Password</h2>
          <p className="subtitle">
            {submitted 
              ? "Check your email for the reset link" 
              : "No worries! Enter your email and we'll send you reset instructions."}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message" style={{
            backgroundColor: '#d4edda',
            borderColor: '#c3e6cb',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* STEP 1: EMAIL REQUEST */}
        {!showResetForm ? (
          <form onSubmit={handleRequestReset}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading || submitted}
                autoComplete="email"
              />
            </div>

            <button type="submit" disabled={loading || submitted}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          // STEP 2: RESET PASSWORD (for development/testing)
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="resetToken">Reset Token</label>
              <input
                id="resetToken"
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste your reset token"
                disabled={loading}
                required
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                You received this in your email
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResetForm(false)
                setResetToken('')
                setNewPassword('')
                setConfirmPassword('')
              }}
              disabled={loading}
              style={{
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px',
              }}
            >
              ← Back to email request
            </button>
          </form>
        )}

        {/* Back to Login */}
        <p className="back-login-text">
          <Link href="/login">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  )
}