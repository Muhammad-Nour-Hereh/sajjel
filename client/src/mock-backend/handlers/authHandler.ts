import { http } from 'msw'
import { api } from '@/http/api'
import { LoginRequest, RegisterRequest } from '@/types/requests/authRequests'
import { fail, noContent, ok } from '../utils/responses'
import { url } from '../utils/utils'

interface User {
  id: number
  name: string
  email: string
  password: string
}

let users: User[] = [
  { id: 1, name: 'admin', email: 'admin@admin.com', password: '121212' },
]
let currentId = 2

// --- helpers (keep mock outputs consistent with backend) ---
const makeToken = (userId: number) => `mock-token-${userId}`

function getUserFromAuthHeader(req: Request): User | null {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice('Bearer '.length)
  const userId = Number(token.replace('mock-token-', ''))
  return users.find((u) => u.id === userId) ?? null
}

const authHandlers = [
  // Register -> 201 + token in data
  http.post(url(api.auth.register), async ({ request }) => {
    const { name, email, password } = (await request.json()) as RegisterRequest

    if (users.some((u) => u.email === email)) {
      return fail('email already registered.', 409)
    }

    const user: User = { id: currentId++, name, email, password }
    users.push(user)

    const token = makeToken(user.id)
    return ok<string>(token, 201)
  }),

  // Login -> 200 + token in data
  http.post(url(api.auth.login), async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequest
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return fail('invalid credentials', 401)
    }

    const token = makeToken(user.id)
    return ok<string>(token, 200)
  }),

  // Me -> 200 + user in data (requires Bearer)
  http.get(url(api.auth.me), async ({ request }) => {
    const user = getUserFromAuthHeader(request)
    if (!user) return fail('Not authenticated', 401)

    return ok<{ id: number; name: string; email: string }>(
      { id: user.id, name: user.name, email: user.email },
      200,
    )
  }),

  // Logout -> 204 No Content (no storage side-effects)
  http.post(url(api.auth.logout), async () => {
    return noContent()
  }),
]

export default authHandlers
