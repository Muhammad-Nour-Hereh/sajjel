import PrivilegeLevel from '../value-objects/Privileges'

export interface UpdateUserPrivilegesRequest {
  cost: PrivilegeLevel
  inventory: PrivilegeLevel
}
