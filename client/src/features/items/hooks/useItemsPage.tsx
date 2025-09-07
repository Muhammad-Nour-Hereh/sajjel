import { useState } from 'react'
import useItemQueries from '@/remotes/tanstack/useItemQueries'

const useItemsPage = () => {
  const [search, setSearch] = useState('')
  const { items } = useItemQueries()
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  return {
    search,
    setSearch,
    filteredItems,
  }
}

export default useItemsPage
