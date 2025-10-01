import { Input } from '@/components/ui/Input2'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  placeholder?: string
  onChange: (v: string) => void
  className?: string
}

const SearchBar = ({
  value,
  placeholder = 'Search ...',
  onChange,
  className,
}: SearchBarProps) => (
  <div className={cn('relative w-full max-w-md mx-auto mb-6', className)}>
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      size={18}
    />
    <Input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-9"
    />
  </div>
)

export default SearchBar
