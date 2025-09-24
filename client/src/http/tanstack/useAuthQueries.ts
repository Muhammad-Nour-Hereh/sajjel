import { useQuery } from '@tanstack/react-query'
import { remote } from '../remotes'

const useAuthQueries = () => {
  const {
    data: auth,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: remote.auth.me,
  })

  return { auth, isLoading, isError }
}

export default useAuthQueries
