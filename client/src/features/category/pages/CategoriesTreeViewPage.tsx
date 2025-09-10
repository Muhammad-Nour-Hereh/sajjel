import TreeView, { TreeNode } from '@/components/ui/TreeView'
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import { categoryToTreeNode } from '@/utils/tree-nodes-converters'

const CategoriesTreeViewPage = () => {
  const { categories } = useCategoryQueries()

  const treeNodes: TreeNode[] = categories.map(categoryToTreeNode)

  return (
    <div>
      <TreeView data={treeNodes} />
    </div>
  )
}

export default CategoriesTreeViewPage
