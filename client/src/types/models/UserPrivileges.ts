import PrivilegeLevel from '../value-objects/PrivilegeLevel'

interface UserPrivileges {
  user_id: number
  cost: PrivilegeLevel
  inventory: PrivilegeLevel
}

export default UserPrivileges
