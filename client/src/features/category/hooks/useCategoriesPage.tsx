import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import { useState } from 'react'

const useCategoriesPage = () => {
  const [search, setSearch] = useState('')
  const { categories } = useCategoryQueries()
  const filteredcategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  )
  
  return {
    search,
    setSearch,
    filteredcategories,
  }
}

export default useCategoriesPage
