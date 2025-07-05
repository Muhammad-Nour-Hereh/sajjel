import useItemsPage from '@/hooks/useItemsPage'

const ItemsPage = () => {
  const { items } = useItemsPage()

  return (
    <div>
      {items.map((item, index) => (
        <p key={index}>{item.title}</p>
      ))}
    </div>
  )
}

export default ItemsPage
