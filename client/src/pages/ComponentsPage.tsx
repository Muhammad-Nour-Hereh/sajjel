import InlineNum from '@/components/inline/InlineNum'
import TreeView, { TreeNode } from '@/components/ui/TreeView'
import { useState } from 'react'

// Sample data structure
const sampleData: TreeNode[] = [
  {
    id: '1',
    name: 'Electronics',
    type: 'category',
    children: [
      {
        id: '1-1',
        name: 'Computers',
        type: 'category',
        children: [
          { id: '1-1-1', name: 'Laptops', type: 'item' },
          { id: '1-1-2', name: 'Desktops', type: 'item' },
          { id: '1-1-3', name: 'Tablets', type: 'item' },
        ],
      },
      {
        id: '1-2',
        name: 'Mobile Devices',
        type: 'category',
        children: [
          { id: '1-2-1', name: 'Smartphones', type: 'item' },
          { id: '1-2-2', name: 'Smart Watches', type: 'item' },
        ],
      },
      { id: '1-3', name: 'Headphones', type: 'item' },
    ],
  },
  {
    id: '2',
    name: 'Clothing',
    type: 'category',
    children: [
      {
        id: '2-1',
        name: "Men's Clothing",
        type: 'category',
        children: [
          { id: '2-1-1', name: 'Shirts', type: 'item' },
          { id: '2-1-2', name: 'Pants', type: 'item' },
          { id: '2-1-3', name: 'Shoes', type: 'item' },
        ],
      },
      {
        id: '2-2',
        name: "Women's Clothing",
        type: 'category',
        children: [
          { id: '2-2-1', name: 'Dresses', type: 'item' },
          { id: '2-2-2', name: 'Blouses', type: 'item' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Books',
    type: 'category',
    children: [
      { id: '3-1', name: 'Fiction', type: 'item' },
      { id: '3-2', name: 'Non-Fiction', type: 'item' },
      { id: '3-3', name: 'Technical', type: 'item' },
    ],
  },
]

const ComponentsPage = () => {
  // const [numberValue, setNumberValue] = useState(42)
  // const [value, setValue] = useState('abc')
  return (
    <div>
      <TreeView data={sampleData} onItemClick={() => {}} />

      {/* <p>{numberValue}</p>
      <InlineNum
        value={numberValue}
        setValue={setNumberValue}
        onChange={(val) => console.log(val)}
      /> */}

      {/* <InlineTextInput value={value} onChange={setValue} /> */}
      {/* <input type="text" value={'a'} /> */}
    </div>
  )
}

export default ComponentsPage
