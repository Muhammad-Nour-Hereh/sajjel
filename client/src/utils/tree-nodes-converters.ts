import { TreeNode } from '@/components/ui/TreeView'
import { Category } from '@/types/models/Category'
import { Item } from '@/types/models/Item'

/** Convert one Category to a TreeNode (recursively handles children & items) */
function categoryToTreeNode(category: Category): TreeNode {
  return {
    id: `C${category.id}`, // Category prefix
    name: category.name,
    type: 'category',
    children: [
      // First, all subcategories
      ...(category.children?.map(categoryToTreeNode) ?? []),

      // Then, all items inside this category
      ...(category.items?.map((item) => itemToTreeNode(item)) ?? []),
    ],
  }
}

/** Convert one Item to a TreeNode */
function itemToTreeNode(item: Item): TreeNode {
  return {
    id: `I${item.id}`, // Item prefix
    name: item.name,
    type: 'item',
    children: [], // Items have no children
  }
}

export { categoryToTreeNode, itemToTreeNode }
