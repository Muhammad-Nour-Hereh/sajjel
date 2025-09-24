import { Navigate, Outlet } from 'react-router-dom'
import LoadingPage from '@/pages/LoadingPage'
import useAuthQueries from '@/http/tanstack/useAuthQueries'

const UserLayout = () => {
  const { auth, isLoading, isError } = useAuthQueries()

  if (isError) {
    localStorage.removeItem('access_token')
  }

  const isAuthenticated = !!auth?.success
  if (isLoading) return <LoadingPage />

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default UserLayout
