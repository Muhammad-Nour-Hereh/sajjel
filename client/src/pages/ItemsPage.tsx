import useItemsPage from '@/hooks/useItemsPage'
import SearchBar from '@/components/ui/Searchbar'
import FloatActionButton from '@/components/ui/FloatActionButton'
import ItemCard from '@/components/ui/ItemCard'

const ItemsPage = () => {
  const { search, setSearch, filteredItems, updateItem } = useItemsPage()

  return (
    <div className="p-4">
      <SearchBar value={search} onChange={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemCard item={item} updateItem={updateItem} />
        ))}
        <FloatActionButton
          onClick={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      </div>
    </div>
  )
}

export default ItemsPage
