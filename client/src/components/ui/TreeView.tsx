import type React from 'react'
import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TreeNode {
  id: string
  name: string
  type: 'category' | 'item'
  children?: TreeNode[]
}

interface TreeNodeProps {
  item: TreeNode
  level: number
  onItemClick?: (item: TreeNode) => void
}

const TreeNode: React.FC<TreeNodeProps> = ({ item, level, onItemClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isCategory = item.type === 'category'

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    onItemClick?.(item)
  }

  const getIcon = () => {
    if (isCategory) {
      if (hasChildren) {
        return isExpanded ? (
          <FolderOpen className="h-4 w-4" />
        ) : (
          <Folder className="h-4 w-4" />
        )
      }
      return <Folder className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const getChevron = () => {
    if (!hasChildren) return null
    return isExpanded ? (
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    ) : (
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    )
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          isCategory ? 'font-medium' : 'font-normal text-muted-foreground',
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleToggle}>
        <div className="flex items-center gap-1">
          {getChevron()}
          <div
            className={cn(
              'flex items-center gap-2',
              isCategory ? 'text-primary' : 'text-muted-foreground',
            )}>
            {getIcon()}
            <span className="text-sm">{item.name}</span>
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="transition-all duration-200 ease-in-out">
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface TreeViewProps {
  data: TreeNode[]
  onItemClick?: (item: TreeNode) => void
  className?: string
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onItemClick,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {data.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          level={0}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  )
}

export default TreeView
