export const validateName = (name: string): string => {
  if (!name.trim()) return 'This field is required'
  if (name.length < 2) return 'Must be at least 2 characters'
  return ''
}

export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email'
  return ''
}

export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Must be at least 6 characters'
  return ''
}

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string => {
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}
