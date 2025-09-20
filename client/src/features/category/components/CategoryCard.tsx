import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EditImage from '@/components/ui/EditImage'
import { TextInput } from '@/components/ui/TextInput'
import { Category } from '@/types/models/Category'
import { PatchCategoryRequest } from '@/types/requests/categoryRequests'
import { getImageUrl } from '@/utils/imageUrl.ts'

interface Props {
  category: Category
  editable?: boolean
  patchCategory: (args: { id: number; data: PatchCategoryRequest }) => void
  updateThumbnail: (args: { id: number; data: FormData }) => void
}

const CategoryCard = ({
  category,
  editable = true,
  patchCategory,
  updateThumbnail,
}: Props) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      {category.thumbnail && (
        <EditImage
          src={getImageUrl(category.thumbnail)} 
          alt={category.name}
          editable={editable}
          onChange={async (file: File) => {
            const formData = new FormData()
            formData.append('thumbnail', file)
            updateThumbnail({ id: category.id, data: formData })
          }}
        />
      )}
      <CardHeader>
        <CardTitle>
          <TextInput
            value={category.name}
            onChange={(val) =>
              patchCategory({ id: category.id, data: { name: val } })
            }
            editable={editable}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TextInput
          value={category.description}
          onChange={(val) =>
            patchCategory({ id: category.id, data: { description: val } })
          }
          editable={editable}
        />
      </CardContent>
    </Card>
  )
}

export default CategoryCard
