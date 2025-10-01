import { http } from 'msw'
import { api } from '@/http/api'
import { fail, notFound, ok } from '../utils/responses'
import { url } from '../utils/utils'
import UpdateUserPrivilegesRequest from '@/types/requests/UserPrivilegesRequest'
import userPrivilegesSeed from '../data/userPrivileges.json'
import UserPrivileges from '@/types/models/UserPrivileges'
import PrivilegeLevel from '@/types/value-objects/PrivilegeLevel'

let userPrivileges: UserPrivileges[] =
  (userPrivilegesSeed as UserPrivileges[]) ?? []

const userPrivilegesHandlers = [
  // GET /users/:userId/privileges
  http.get<{ id: string }>(
    url(api.user.userPrivileges.show),
    async ({ params }) => {
      // get id
      const userId = Number(params.id)
      if (!userId) return notFound('Invalid user ID')

      // Find user privileges by user_id
      const privileges = userPrivileges.find((p) => p.user_id === userId)
      if (!privileges) {
        // If no privileges found, return default (all NONE)
        const defaultPrivileges: UserPrivileges = {
          user_id: userId,
          cost: PrivilegeLevel.NONE,
          price: PrivilegeLevel.NONE,
          inventory: PrivilegeLevel.NONE,
          item: PrivilegeLevel.NONE,
          category: PrivilegeLevel.NONE,
        }
        return ok<UserPrivileges>(defaultPrivileges)
      }

      return ok<UserPrivileges>(privileges)
    },
  ),

  // PUT /users/:userId/privileges
  http.put<{ id: string }>(
    url(api.user.userPrivileges.update),
    async ({ request, params }) => {
      const userId = Number(params.id)
      if (!userId) return notFound('Invalid user ID')

      const updateData = (await request.json()) as UpdateUserPrivilegesRequest

      // Validate privilege levels (0, 1, or 2)
      if (
        updateData.cost !== undefined &&
        ![0, 1, 2].includes(updateData.cost)
      ) {
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
          price: updateData.price ?? 0,
          inventory: updateData.inventory ?? 0,
          item: updateData.item ?? 0,
          category: updateData.category ?? 0,
        }
        userPrivileges.push(newPrivileges)
        existingPrivileges = newPrivileges
      }

      return ok<UserPrivileges>(existingPrivileges)
    },
  ),
]

export default userPrivilegesHandlers
