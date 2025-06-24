import { Navigate, Outlet } from "react-router-dom"

const UserLayout = () => {
  const isAuthorized = true
  return isAuthorized ? <Outlet /> : <Navigate to="/login" />
}

export default UserLayout
