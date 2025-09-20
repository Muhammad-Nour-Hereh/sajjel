import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { remote } from '../remotes'
import { UpdateUserPrivilegesRequest } from '@/types/requests/UserPrivilegesRequest'

const useUserPrivilegesQueries = (userId: number) => {
  const queryClient = useQueryClient()

  const {
    data: userPrivileges,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['userPrivileges', userId],
    queryFn: () => remote.user.privileges.show(userId),
    enabled: !!userId, // Only run query if userId is provided
  })

  const updatePrivileges = useMutation({
    mutationFn: (data: UpdateUserPrivilegesRequest) =>
      remote.user.privileges.update(userId, data),
    onSuccess: () => {
      // Invalidate the specific user's privileges
      queryClient.invalidateQueries({ queryKey: ['userPrivileges', userId] })
      // Also invalidate all user privileges if you have a list view
      queryClient.invalidateQueries({ queryKey: ['userPrivileges'] })
    },
  })

  return {
    userPrivileges,
    isLoading,
    isError,
    updatePrivileges: updatePrivileges.mutate,
    isUpdating: updatePrivileges.isPending,
  }
}

export default useUserPrivilegesQueries
