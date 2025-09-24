import useAuthQueries from '@/http/tanstack/useAuthQueries'
import Role from '@/types/value-objects/Role'

const useRole = () => {
  const { auth } = useAuthQueries()
  const role = auth?.data?.role
  const isUser = auth?.data?.role === Role.USER
  const isAdmin = auth?.data?.role === Role.ADMIN

  return { role, isUser, isAdmin }
}

export default useRole
