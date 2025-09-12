import { TreeNode } from '@/components/ui/TreeView'
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import { categoryToTreeNode } from '@/utils/tree-nodes-converters'
import { useState } from 'react'

const useCategoriesPage = () => {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'tree'>('card')
  const { categories } = useCategoryQueries()
  const filteredcategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  )
  const treeData: TreeNode[] = categories.map(categoryToTreeNode)
  return {
    search,
    setSearch,
    filteredcategories,
    viewMode,
    setViewMode,
    treeData,
  }
}

export default useCategoriesPage
