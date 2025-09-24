import useUserPrivilegesQueries from '@/http/tanstack/useUserPrivilegesQueries'
import User from '@/types/models/User'
import PrivilegeLevel from '@/types/value-objects/PrivilegeLevel'
import Privileges from '@/types/value-objects/Privileges'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  user: User | null
}

export const usePrivilegeEditor = ({ user }: Props) => {
  const { userPrivileges, updatePrivileges, isLoading, isUpdating } =
    useUserPrivilegesQueries(user?.id || 0)
  const [privilegeForm, setPrivilegeForm] = useState<Privileges>({
    cost: PrivilegeLevel.NONE,
    price: PrivilegeLevel.NONE,
    inventory: PrivilegeLevel.NONE,
    item: PrivilegeLevel.NONE,
    category: PrivilegeLevel.NONE,
  })

  // Update form when privileges load
  useEffect(() => {
    if (userPrivileges) {
      setPrivilegeForm({
        cost: userPrivileges.cost,
        price: userPrivileges.price,
        inventory: userPrivileges.inventory,
        item: userPrivileges.item,
        category: userPrivileges.category,
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
    category: 'cost' | 'price' | 'inventory' | 'item' | 'category',
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
      key: 'price' as const,
      name: 'price',
      description: 'prices management and viewing',
    },
    {
      key: 'inventory' as const,
      name: 'Inventory',
      description: 'Inventory management and viewing',
    },
    {
      key: 'item' as const,
      name: 'item',
      description: 'item management and viewing',
    },
    {
      key: 'category' as const,
      name: 'category',
      description: 'category management and viewing',
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
