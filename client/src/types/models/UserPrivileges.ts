import Privileges from '../value-objects/Privileges'

interface UserPrivileges extends Privileges {
  user_id: number
}

export default UserPrivileges
