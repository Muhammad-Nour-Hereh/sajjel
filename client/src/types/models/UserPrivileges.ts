import PrivilegeLevel from '../value-objects/PrivilegeLevel'

interface UserPrivileges {
  cost: PrivilegeLevel
  inventory: PrivilegeLevel
}

export default UserPrivileges
