import { http } from 'msw'
import { api } from '@/http/api'
import { LoginRequest, RegisterRequest } from '@/types/requests/authRequests'
import {
  conflict,
  created,
  noContent,
  ok,
  unauthorized,
} from '../utils/responses'
import { Id, url } from '../utils/utils'
import _User from '@/types/models/User'
import Me from '@/types/models/Me'
// data import
import usersSeed from '../data/users.json'
import privilegesSeed from '../data/userPrivileges.json'
import UserPrivileges from '@/types/models/UserPrivileges'
import Privileges from '@/types/value-objects/Privileges'

interface User extends _User {
  password: string
}

let users: User[] = (usersSeed as User[]) ?? []
let privileges: UserPrivileges[] = (privilegesSeed as UserPrivileges[]) ?? []
const curId = new Id(users)

// --- helpers (keep mock outputs consistent with backend) ---
const makeToken = (userId: number) => `mock-token-${userId}`

function getUserFromAuthHeader(req: Request): User | null {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice('Bearer '.length)
  const userId = Number(token.replace('mock-token-', ''))
  return users.find((u) => u.id === userId) ?? null
}

// helpers
function sanitizeUser(u: User): Omit<User, 'password'> {
  const { password, ...safe } = u
  return safe
}

function toPrivileges(p: UserPrivileges): Privileges {
  const { user_id: _omit, ...rest } = p
  return rest as Privileges
}

const authHandlers = [
  // Register -> 201 + token in data
  http.post(url(api.auth.register), async ({ request }) => {
    const { name, email, password } = (await request.json()) as RegisterRequest

    if (users.some((u) => u.email === email)) {
      return conflict('email already registered')
    }

    const user: User = {
      id: curId.nextId(),
      name,
      email,
      password,
      role: 'USER',
    }
    users.push(user)

    const token = makeToken(user.id)
    return created<string>(token)
  }),

  // Login -> 200 + token in data
  http.post(url(api.auth.login), async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return unauthorized('invalid credentials')
    }

    const token = makeToken(user.id)
    return ok<string>(token, 200)
  }),

  // Me -> 200 + user in data (requires Bearer)
  http.get(url(api.auth.me), async ({ request }) => {
    const user = getUserFromAuthHeader(request)
    if (!user) return unauthorized()

    const p = privileges.find((p) => p.user_id === user.id)
    if (!p) return unauthorized('privileges not found')

    return ok<Me>({
      ...sanitizeUser(user), // no password
      privileges: toPrivileges(p), // no user_id
    })
  }),

  http.post(url(api.auth.logout), async () => {
    return noContent()
  }),
]

export default authHandlers
