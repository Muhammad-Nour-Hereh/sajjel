import { remote } from '@/remotes/remotes'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const GuestLayout = () => {
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

  if (loading) return <div>Loading...</div>

  return isAuthorized ? <Navigate to="/home" /> : <Outlet />
}

export default GuestLayout
