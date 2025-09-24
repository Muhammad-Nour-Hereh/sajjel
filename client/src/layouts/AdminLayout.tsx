import { Navigate, Outlet } from 'react-router-dom'
import LoadingPage from '@/pages/LoadingPage'
import useAuthQueries from '@/http/tanstack/useAuthQueries'
import ForbiddenPage from '@/pages/ForbiddenPage'
import Role from '@/types/value-objects/Role'

const AdminLayout = () => {
  const { auth, isLoading, isError } = useAuthQueries()

  if (isError) {
    localStorage.removeItem('access_token')
  }

  const isAuthenticated = !!auth?.success
  const user = auth?.data
  const isAdmin = user?.role === Role.ADMIN

  if (isLoading) return <LoadingPage />

  if (!isAuthenticated) return <Navigate to="/login" />

  if (!isAdmin) return <ForbiddenPage subtitle="Admin access required." />

  return <Outlet />
}

export default AdminLayout
