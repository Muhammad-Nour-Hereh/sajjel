import useItemsPage from '@/features/items/hooks/useItemsPage'
import SearchBar from '@/components/ui/Searchbar'
import ItemCard from '../components/ItemCard'
import CreateItemDialog from '@/features/items/components/CreateItemDialog'
import useItemQueries from '@/http/tanstack/useItemQueries'
import usePrivileges from '@/hooks/usePrivilege'
import ForbiddenPage from '@/pages/ForbiddenPage'

const ItemsPage = () => {
  const { search, setSearch, filteredItems } = useItemsPage()
  const { updateItem, updateThumbnail } = useItemQueries()
  const { itemPrivilege } = usePrivileges()

  if (!itemPrivilege.canRead()) {
    return (
      <ForbiddenPage
        message="You don't have permission to view items."
        subtitle="Contact your administrator for access."
      />
    )
  }

  return (
    <div className="p-4">
      <SearchBar value={search} onChange={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            editable={itemPrivilege.canWrite()}
            item={item}
            updateItem={updateItem}
            updateThumbnail={updateThumbnail}
          />
        ))}
      </div>

      {itemPrivilege.canWrite() && <CreateItemDialog />}
    </div>
  )
}

export default ItemsPage
