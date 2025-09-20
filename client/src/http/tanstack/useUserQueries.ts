import { useQuery } from '@tanstack/react-query'
import { remote } from '../remotes'

export const useUserQueries = () => {
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: remote.user.index,
  })

  return {
    users,
    isLoading,
    isError,
  }
}

export default useUserQueries
