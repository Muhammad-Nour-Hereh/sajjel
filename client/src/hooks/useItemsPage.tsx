import { remote } from '@/remotes/remotes'
import { useEffect, useState } from 'react'
import type { Item } from '@/models/Item'

const useItemsPage = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      const result = await remote.items.fetchAll()
      console.log(result.data)
      if (result.data === undefined) result.data = []
      setItems(result.data)
    }

    fetchItems()
  }, [])

  return { items }
}

export default useItemsPage
