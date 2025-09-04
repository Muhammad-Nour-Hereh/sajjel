import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from '../../../utils/validators'
import { remote } from '../../../remotes/remotes'
import UserRoutes from '@/routes/UserRoutes'
import GuestRoutes from '@/routes/GuestRoutes'


type FieldErrors = Record<string, string>

const useRegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')

  const [errors, setErrors] = useState<FieldErrors>({})
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors: FieldErrors = {}

    newErrors.name = validateName(name)
    newErrors.email = validateEmail(email)
    newErrors.password = validatePassword(password)
    newErrors.repassword = validateConfirmPassword(password, repassword)

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  // handles
  const RegisterHandle = async () => {
    if (!validateForm()) return

    try {
      const res = await remote.auth.register({ name, email, password })
      if (!res.success) {
        setErrors({ general: res.message || 'something went wrong' })
        return
      }

      if (!res.data) return

      localStorage.setItem('access_token', res.data)

      navigate(UserRoutes.HOME)
    } catch (error) {
      setErrors({ general: 'something went wrong' })
    }
  }

  const navigateLoginHandle = () => navigate(GuestRoutes.LOGIN)

  useEffect(() => {
    console.log('register page is loaded')
  }, [])

  return {
    email,
    setEmail,
    name,
    setName,
    password,
    setPassword,
    repassword,
    setRepassword,
    errors,
    RegisterHandle,
    navigateLoginHandle,
  }
}

export default useRegisterPage
