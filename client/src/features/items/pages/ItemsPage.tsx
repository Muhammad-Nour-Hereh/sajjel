import useItemsPage from '@/features/items/hooks/useItemsPage'
import SearchBar from '@/components/ui/Searchbar'
import ItemCard from '@/components/ui/ItemCard'
import CreateItemDialog from '@/components/ui/dialogs/CreateItemDialog'

const ItemsPage = () => {
  const {
    search,
    setSearch,
    filteredItems,
    createItem,
    updateItem,
    updateThumbnail,
  } = useItemsPage()

  return (
    <div className="p-4">
      <SearchBar value={search} onChange={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            updateItem={updateItem}
            updateThumbnail={updateThumbnail}
          />
        ))}
      </div>

      <CreateItemDialog createItem={createItem} />
    </div>
  )
}

export default ItemsPage
