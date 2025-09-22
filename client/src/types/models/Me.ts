import Privileges from '../value-objects/Privileges'
import Role from '../value-objects/Role'

export default interface Me {
  success: boolean
  user: {
    id: number
    name: string
    email?: string | null
  } | null
  roles: Role
  privileges: Privileges
}
