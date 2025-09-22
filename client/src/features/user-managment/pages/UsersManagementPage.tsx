import { Users } from 'lucide-react'
import { UserSelector } from '../components/UserSelector'
import { PrivilegeEditor } from '../components/PrivilegeEditor'
import useUserManagement from '../hooks/useUserManagement'

const UsersManagementPage = () => {
  const { selectedUser, setSelectedUser } = useUserManagement()

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b flex items-center gap-3 container mx-auto p-4 ">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UserSelector
            selectedUser={selectedUser}
            onUserSelect={setSelectedUser}
          />
        </div>
        <div className="lg:col-span-2">
          <PrivilegeEditor user={selectedUser} />
        </div>
      </div>
    </div>
  )
}

export default UsersManagementPage
