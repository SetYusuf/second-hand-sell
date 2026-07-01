const AUTH_KEYS = ['token', 'authToken', 'user', 'userEmail', 'userName', 'userId', 'userRole', 'customAvatar']

export function clearAuthSession() {
  if (typeof window === 'undefined') return

  AUTH_KEYS.forEach((key) => window.sessionStorage.removeItem(key))
  window.dispatchEvent(new Event('auth-storage'))
}

export function setAuthSession(token: string, user: Record<string, any>) {
  if (typeof window === 'undefined') return

  clearAuthSession()

  const normalizedUser = {
    ...user,
    id: user.id || user._id || '',
    name: user.name || '',
    email: user.email || '',
    role: user.role || 'user',
    avatar: user.avatar || '',
  }

  window.sessionStorage.setItem('token', token)
  window.sessionStorage.setItem('authToken', token)
  window.sessionStorage.setItem('user', JSON.stringify(normalizedUser))
  window.sessionStorage.setItem('userEmail', normalizedUser.email)
  window.sessionStorage.setItem('userName', normalizedUser.name)
  window.sessionStorage.setItem('userId', normalizedUser.id)
  window.sessionStorage.setItem('userRole', normalizedUser.role)

  window.dispatchEvent(new Event('auth-storage'))
}

export function getStoredAuthToken() {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem('token') || window.sessionStorage.getItem('authToken') || ''
}

export function getStoredAuthUser() {
  if (typeof window === 'undefined') return null

  const savedUser = window.sessionStorage.getItem('user')
  if (!savedUser) return null

  try {
    return JSON.parse(savedUser)
  } catch {
    return null
  }
}

export function getStoredUserId() {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem('userId') || ''
}

export function getStoredUserEmail() {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem('userEmail') || ''
}

export function getStoredUserName() {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem('userName') || ''
}

export function getStoredUserRole() {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem('userRole') || ''
}

export function getStoredCustomAvatar() {
  if (typeof window === 'undefined') return ''
  return window.sessionStorage.getItem('customAvatar') || ''
}
