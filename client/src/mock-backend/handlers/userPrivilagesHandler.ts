import { http } from 'msw'
import { api } from '@/http/api'
import { fail, ok } from '../utils/responses'
import { url } from '../utils/utils'
import { UpdateUserPrivilegesRequest } from '@/types/requests/UserPrivilegesRequest'
import userPrivilegesSeed from '../data/userPrivileges.json'
import usersSeed from '../data/users.json'
import UserPrivileges from '@/types/models/UserPrivileges'

interface User {
  id: number
  name: string
  email: string
  password: string
}

let userPrivileges: UserPrivileges[] =
  (userPrivilegesSeed as UserPrivileges[]) ?? []
let users: User[] = (usersSeed as User[]) ?? []

// Helper function to get user from auth header (copied from authHandler)
function getUserFromAuthHeader(req: Request): User | null {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice('Bearer '.length)
  const userId = Number(token.replace('mock-token-', ''))
  return users.find((u) => u.id === userId) ?? null
}

const userPrivilegesHandlers = [
  // GET /users/:userId/privileges
  http.get(url(api.user.userPrivileges.show), async ({ request, params }) => {
    const user = getUserFromAuthHeader(request)
    if (!user) return fail('Not authenticated', 401)

    const userId = Number(params.userId)
    if (!userId) return fail('Invalid user ID', 400)

    // Find user privileges by user_id
    const privileges = userPrivileges.find((p) => p.user_id === userId)
    if (!privileges) {
      // If no privileges found, return default (all NONE)
      const defaultPrivileges: UserPrivileges = {
        user_id: userId,
        cost: 0, // PrivilegeLevel.NONE
        inventory: 0, // PrivilegeLevel.NONE
      }
      return ok<UserPrivileges>(defaultPrivileges)
    }

    return ok<UserPrivileges>(privileges)
  }),

  // PUT /users/:userId/privileges
  http.put(url(api.user.userPrivileges.update), async ({ request, params }) => {
    const user = getUserFromAuthHeader(request)
    if (!user) return fail('Not authenticated', 401)

    const userId = Number(params.userId)
    if (!userId) return fail('Invalid user ID', 400)

    const updateData = (await request.json()) as UpdateUserPrivilegesRequest

    // Validate privilege levels (0, 1, or 2)
    if (updateData.cost !== undefined && ![0, 1, 2].includes(updateData.cost)) {
      return fail('Invalid cost privilege level', 400)
    }
    if (
      updateData.inventory !== undefined &&
      ![0, 1, 2].includes(updateData.inventory)
    ) {
      return fail('Invalid inventory privilege level', 400)
    }

    // Find existing privileges or create new ones
    let existingPrivileges = userPrivileges.find((p) => p.user_id === userId)

    if (existingPrivileges) {
      // Update existing privileges
      existingPrivileges.cost = updateData.cost ?? existingPrivileges.cost
      existingPrivileges.inventory =
        updateData.inventory ?? existingPrivileges.inventory
    } else {
      // Create new privileges entry
      const newPrivileges: UserPrivileges = {
        user_id: userId,
        cost: updateData.cost ?? 0,
        inventory: updateData.inventory ?? 0,
      }
      userPrivileges.push(newPrivileges)
      existingPrivileges = newPrivileges
    }

    return ok<UserPrivileges>(existingPrivileges)
  }),
]

export default userPrivilegesHandlers
