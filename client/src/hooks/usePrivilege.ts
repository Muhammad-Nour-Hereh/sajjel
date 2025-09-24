import useAuthQueries from '@/http/tanstack/useAuthQueries'
import PrivilegeLevel from '@/types/value-objects/PrivilegeLevel'
import { useMemo } from 'react'

export class PrivilegeWrapper {
  constructor(private level: PrivilegeLevel) {}

  canRead(): boolean {
    return this.level >= PrivilegeLevel.READ
  }

  canWrite(): boolean {
    return this.level >= PrivilegeLevel.WRITE
  }

  get value(): PrivilegeLevel {
    return this.level
  }
}

const usePrivileges = () => {
  const { auth } = useAuthQueries()

  const privileges = auth?.data?.privileges

  return useMemo(
    () => ({
      costPrivilege: new PrivilegeWrapper(
        privileges?.cost ?? PrivilegeLevel.NONE,
      ),
      pricePrivilege: new PrivilegeWrapper(
        privileges?.price ?? PrivilegeLevel.NONE,
      ),
      inventoryPrivilege: new PrivilegeWrapper(
        privileges?.inventory ?? PrivilegeLevel.NONE,
      ),
    }),
    [privileges?.cost, privileges?.price, privileges?.inventory],
  )
}

export default usePrivileges
