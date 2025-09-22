import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Shield, Eye, Edit3, X } from 'lucide-react'
import User from '@/types/models/User'
import PrivilegeLevel from '@/types/value-objects/Privileges'
import { usePrivilegeEditor } from '../hooks/usePrivilegeEditor'

interface Props {
  user: User | null
}

export function PrivilegeEditor({ user }: Props) {
  const {
    privilegeForm,
    handleSave,
    isLoading,
    isUpdating,
    updatePrivilege,
    privilegeCategories,
  } = usePrivilegeEditor({ user })

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Privileges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Select a user to manage their privileges
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Privileges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-32" />
                  <div className="h-3 bg-muted animate-pulse rounded w-48" />
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, j) => (
                    <div
                      key={j}
                      className="w-16 h-8 bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privileges for {user.name}
          </CardTitle>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {privilegeCategories.map((category) => {
            const currentLevel = privilegeForm[category.key]

            return (
              <div
                key={category.key}
                className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    key={PrivilegeLevel.NONE}
                    variant={
                      currentLevel === PrivilegeLevel.NONE
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      updatePrivilege(category.key, PrivilegeLevel.NONE)
                    }
                    className={`flex items-center gap-1 min-w-[80px] ${
                      currentLevel === PrivilegeLevel.NONE
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : ''
                    }`}>
                    <X className="w-4 h-4" />
                    None
                  </Button>
                  <Button
                    key={PrivilegeLevel.READ}
                    variant={
                      currentLevel === PrivilegeLevel.READ
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      updatePrivilege(category.key, PrivilegeLevel.READ)
                    }
                    className={`flex items-center gap-1 min-w-[80px] ${
                      currentLevel === PrivilegeLevel.READ
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : ''
                    }`}>
                    <Eye className="w-4 h-4" />
                    Read
                  </Button>

                  <Button
                    key={PrivilegeLevel.WRITE}
                    variant={
                      currentLevel === PrivilegeLevel.WRITE
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      updatePrivilege(category.key, PrivilegeLevel.WRITE)
                    }
                    className={`flex items-center gap-1 min-w-[80px] ${
                      currentLevel === PrivilegeLevel.WRITE
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : ''
                    }`}>
                    <Edit3 className="w-4 h-4" />
                    Write
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
