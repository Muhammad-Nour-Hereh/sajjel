import SearchBar from '@/components/ui/Searchbar'
import useCategoriesPage from '../hooks/useCategoriesPage'
import CategoryCard from '../components/CategoryCard'
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import CreateCategoryDialog from '../components/CreateCategoryDialog'
import { Button } from '@/components/ui/button'
import { LayoutGrid, TreePine } from 'lucide-react'
import TreeView from '@/components/ui/TreeView'

const CategoriesPage = () => {
  const {
    search,
    setSearch,
    filteredcategories,
    viewMode,
    setViewMode,
    treeData,
  } = useCategoriesPage()
  const { patchCategory, updateThumbnail } = useCategoryQueries()

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('card')}>
            <LayoutGrid className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tree')}>
            <TreePine className="h-4 w-4 mr-2" />
            Tree
          </Button>
        </div>
      </div>
      <SearchBar value={search} onChange={setSearch} />

      {viewMode === 'card' ? (
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
      ) : (
        <div className="bg-card rounded-lg border p-4">
          <TreeView
            data={treeData}
            onItemClick={(item) => console.log('Clicked:', item)}
          />
        </div>
      )}

      <CreateCategoryDialog />
    </div>
  )
}

export default CategoriesPage
