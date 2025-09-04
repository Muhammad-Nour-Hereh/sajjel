import { Outlet } from 'react-router-dom'

const DevLayout = () => {
  const isDev = import.meta.env.VITE_API_APP_DEBUG === 'true'

  if (!isDev) {
    return <div>404 | Not Found</div>
  }

  return <Outlet />
}

export default DevLayout
