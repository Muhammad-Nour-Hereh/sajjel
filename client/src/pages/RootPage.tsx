import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRoutes } from '@/routes/UserRoutes'

const RootPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(UserRoutes.HOME)
  }, [navigate])

  return null
}

export default RootPage
