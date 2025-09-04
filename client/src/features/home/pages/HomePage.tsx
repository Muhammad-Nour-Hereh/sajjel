import { useNavigate } from 'react-router-dom'

import useMainPage from '../hooks/useMainPage'
import { remote } from '@/remotes/remotes'
import UserRoutes from '@/routes/UserRoutes'
import GuestRoutes from '@/routes/GuestRoutes'

const HomePage = () => {
  const { title } = useMainPage()
  const navigate = useNavigate()
  return (
    <div className="p-10">
      <h1 className="font-bold text-3xl">{title}</h1>
      <ul>
        <li
          onClick={() => {
            navigate(UserRoutes.ITEMS)
          }}
          className="block cursor-pointer py-2 text-sm select-none hover:text-gray-700">
          Items
        </li>
        <li
          onClick={() => {
            navigate(UserRoutes.SALES)
          }}
          className="block cursor-pointer py-2 text-sm select-none hover:text-gray-700">
          Sales
        </li>
        <li
          onClick={() => {
            remote.auth.logout()
            localStorage.removeItem('access_token')
            navigate(GuestRoutes.LOGIN)
          }}
          className="block cursor-pointer py-2 text-sm select-none hover:text-gray-700">
          Logout
        </li>
      </ul>
    </div>
  )
}

export default HomePage
