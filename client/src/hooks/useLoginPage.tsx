import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateEmail, validatePassword } from '../utils/validators'
import { remote } from '../remotes/remotes'
import { GuestRoutes } from '../routes/GuestRoutes'
import { UserRoutes } from '@/routes/UserRoutes'

type FieldErrors = Record<string, string>

const useLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors: FieldErrors = {}

    newErrors.email = validateEmail(email)
    newErrors.password = validatePassword(password)

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  // handles
  const LoginHandle = async () => {
    if (!validateForm()) return

    try {
      const res = await remote.auth.login(email, password)
      if (!res.success) {
        setErrors({ general: res.message || 'something went wrong' })
        console.log(errors)
        console.log(res)
        return
      }

      if (!res.data) return
      console.log(res.data)
      localStorage.setItem('access_token', res.data)

      navigate(UserRoutes.HOME)
    } catch (error) {
      setErrors({ general: 'error' })
    }
  }

  const navigateRegisterHandle = () => navigate(GuestRoutes.REGISTER)
  const navigateForgetPasswordHandle = () =>
    navigate(GuestRoutes.FORGETPASSWORD)

  useEffect(() => {
    console.log('login page is loaded')
  }, [])

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    LoginHandle,
    navigateRegisterHandle,
    navigateForgetPasswordHandle,
  }
}

export default useLoginPage
