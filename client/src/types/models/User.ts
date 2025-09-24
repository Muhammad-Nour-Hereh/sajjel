import Role from '../value-objects/Role'

export default interface User {
  id: number
  name: string
  email: string
  role: Role
}
