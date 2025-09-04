import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { remote } from '@/remotes/remotes'
import LoadingPage from '@/pages/LoadingPage'

const UserLayout = () => {
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const res = await remote.auth.me()
      const success = res.success === 'true'

      if (!success) {
        localStorage.removeItem('access_token')
      }

      setIsAuthorized(success)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) return <LoadingPage />

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />
}

export default UserLayout
