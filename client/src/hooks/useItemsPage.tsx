import { remote } from '@/remotes/remotes'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

const useItemsPage = () => {
  const [search, setSearch] = useState('')

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['items'],
    queryFn: () => remote.items.fetchAll().then((res) => res.data),
  })

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  return { search, setSearch, filteredItems, isLoading, isError }
}

export default useItemsPage
