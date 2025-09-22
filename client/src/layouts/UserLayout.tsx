import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { remote } from '@/http/remotes'
import LoadingPage from '@/pages/LoadingPage'

const UserLayout = () => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const res = await remote.auth.me()
      const success = res.success === 'true'

      if (!success) {
        localStorage.removeItem('access_token')
      }

      setIsAuthenticated(success)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) return <LoadingPage />

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default UserLayout
