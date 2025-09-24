import Privileges from '../value-objects/Privileges'
import Role from '../value-objects/Role'

export default interface Me {
  id: number
  name: string
  email?: string
  role: Role
  privileges: Privileges
}
