import { useEffect } from 'react'
import useMainPage from '../hooks/useMainPage'
import { remote } from '../remotes/remotes'
import { useNavigate } from 'react-router-dom'
import { GuestRoutes } from '@/routes/GuestRoutes'
import { UserRoutes } from '@/routes/UserRoutes'

const HomePage = () => {
  const { title } = useMainPage()
  const navigate = useNavigate()
  const call = async () => {
    const res = await remote.auth.login('test@example.com', 'password')
    console.log(res)
  }
  useEffect(() => {
    call()
  }, [])
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
