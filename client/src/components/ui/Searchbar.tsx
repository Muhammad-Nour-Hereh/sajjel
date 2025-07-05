import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'

const SearchBar = ({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) => (
  <div className="relative w-full max-w-md mx-auto mb-6">
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      size={18}
    />
    <Input
      type="search"
      placeholder="Search items..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-9"
    />
  </div>
)

export default SearchBar
