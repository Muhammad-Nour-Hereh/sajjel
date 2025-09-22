import useUserQueries from '@/http/tanstack/useUserQueries'
import { useState } from 'react'

const useUserSelector = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { users = [], isLoading } = useUserQueries()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  return { searchTerm, setSearchTerm, filteredUsers, isLoading }
}

export default useUserSelector
