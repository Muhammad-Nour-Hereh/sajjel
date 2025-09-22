import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import User from '@/types/models/User'
import useUserSelector from '../hooks/useUserSelector'

interface UserSelectorProps {
  selectedUser: User | null
  onUserSelect: (user: User) => void
}

export function UserSelector({
  selectedUser,
  onUserSelect,
}: UserSelectorProps) {
  const { searchTerm, setSearchTerm, filteredUsers, isLoading } =
    useUserSelector()

  return isLoading ? (
    <Card>
      <CardHeader>
        <CardTitle>Select User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 rounded-lg bg-muted animate-pulse">
              <div className="w-10 h-10 bg-muted-foreground/20 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Select User</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Button
              key={user.id}
              variant={selectedUser?.id === user.id ? 'default' : 'ghost'}
              className="w-full justify-start h-auto p-3"
              onClick={() => onUserSelect(user)}>
              <div className="flex items-center space-x-3 w-full">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
            </Button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              {searchTerm
                ? 'No users found matching your search'
                : 'No users available'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
