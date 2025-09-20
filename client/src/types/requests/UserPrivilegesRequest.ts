import PrivilegeLevel from "../value-objects/PrivilegeLevel"

export interface UpdateUserPrivilegesRequest {
  cost: PrivilegeLevel
  inventory: PrivilegeLevel
}

