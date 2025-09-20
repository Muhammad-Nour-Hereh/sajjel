import { api } from '@/http/api'
import { http } from 'msw'
import { url } from '../utils/utils'
import User from '@/types/models/User'
import usersSeed from '../data/users.json'
import { ok } from '../utils/responses'

let users: User[] = (usersSeed as User[]) ?? []

const userHandlers = [
  http.get(url(api.user.index), async () => {
    return ok(users)
  }),
  
  http.get(url(api.user.show), async ({ params }) => {
    const id = Number(params.id)
    const user = users.find((u) => u.id == id)
    return ok(user)
  }),
]

export default userHandlers
