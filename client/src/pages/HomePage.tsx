import { useEffect } from 'react'
import useMainPage from '../hooks/useMainPage'
import { remote } from '../remotes/remotes'

const HomePage = () => {
  const { title } = useMainPage()
  const call = async () => {
    const res = await remote.auth.login('test@example.com', 'password')
    console.log(res)
  }
  useEffect(() => {
    call()
  }, [])
  return <div className="p-10">{title}</div>
}

export default HomePage
