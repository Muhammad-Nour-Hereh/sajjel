import SearchBar from '@/components/ui/Searchbar'
import useCategoriesPage from '../hooks/useCategoriesPage'
import CategoryCard from '../components/CategoryCard'
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import CreateCategoryDialog from '../components/CreateCategoryDialog'
import CategoriesTreeViewPage from './CategoriesTreeViewPage'

const CategoriesPage = () => {
  const { search, setSearch, filteredcategories } = useCategoriesPage()
  const { patchCategory, updateThumbnail } = useCategoryQueries()
  return (
    <div className="p-4">
      <SearchBar value={search} onChange={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredcategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            patchCategory={patchCategory}
            updateThumbnail={updateThumbnail}
          />
        ))}
      </div>

      <CreateCategoryDialog />
      <hr className='m-10'/>
      <CategoriesTreeViewPage />
    </div>
  )
}

export default CategoriesPage
