import { remote } from '@/remotes/remotes'
import { useEffect, useState } from 'react'
import type { Item } from '@/models/Item'

const useItemsPage = () => {
  const [items, setItems] = useState<Item[]>([])
  const [search, setSearch] = useState('')

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
    const fetchItems = async () => {
      const result = await remote.items.fetchAll()
      console.log(result.data)
      if (result.data === undefined) result.data = []
      setItems(result.data)
    }

    fetchItems()
  }, [])

  return { search, setSearch, filteredItems }
}

export default useItemsPage
