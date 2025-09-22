import useUserPrivilegesQueries from '@/http/tanstack/useUserPrivilegesQueries'
import User from '@/types/models/User'
import PrivilegeLevel from '@/types/value-objects/PrivilegeLevel'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  user: User | null
}

export const usePrivilegeEditor = ({ user }: Props) => {
  const { userPrivileges, updatePrivileges, isLoading, isUpdating } =
    useUserPrivilegesQueries(user?.id || 0)
  const [privilegeForm, setPrivilegeForm] = useState({
    cost: PrivilegeLevel.NONE,
    inventory: PrivilegeLevel.NONE,
  })

  // Update form when privileges load
  useEffect(() => {
    if (userPrivileges) {
      setPrivilegeForm({
        cost: userPrivileges.cost,
        inventory: userPrivileges.inventory,
      })
    }
  }, [userPrivileges])

  const handleSave = async () => {
    await updatePrivileges(privilegeForm)
      .then(() => {
        toast('Success', {
          description: 'User updated successfully',
        })
      })
      .catch(() => {
        toast('Error', { description: 'Failed to update user' })
      })
  }

  const updatePrivilege = (
    category: 'cost' | 'inventory',
    level: PrivilegeLevel,
  ) => {
    setPrivilegeForm((prev) => ({
      ...prev,
      [category]: level,
    }))
  }

  const privilegeCategories = [
    {
      key: 'cost' as const,
      name: 'Cost Profit',
      description: 'Access to cost and profit information',
    },
    {
      key: 'inventory' as const,
      name: 'Inventory',
      description: 'Inventory management and viewing',
    },
  ]
  return {
    privilegeForm,
    handleSave,
    isLoading,
    isUpdating,
    updatePrivilege,
    privilegeCategories,
  }
}
