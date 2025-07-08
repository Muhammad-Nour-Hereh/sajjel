import { Item, parseItem } from '@/models/Item'
import { request } from './request'

export const remote = {
  // Auth APIs:
  auth: {
    register: (name: string, email: string, password: string) =>
      request<string>({
        method: 'POST',
        route: '/api/v1/auth/register',
        body: { name, email, password },
      }),

    login: (email: string, password: string) =>
      request<string>({
        method: 'POST',
        route: '/api/v1/auth/login',
        body: { email, password },
      }),

    me: () =>
      request<string>({
        method: 'GET',
        route: '/api/v1/auth/me',
        auth: true,
      }),

    logout: () =>
      request({
        method: 'POST',
        route: '/api/v1/auth/logout',
        auth: true,
      }),
  },
  // Item APIs:
  items: {
    fetchAll: (): Promise<Item[]> =>
      request<Item[]>({
        method: 'GET',
        route: '/api/v1/items',
        auth: true,
      }).then((res): Item[] => (res.data ?? []).map(parseItem)),

    store: (data: Item) =>
      request<Item>({
        method: 'POST',
        route: '/api/v1/items',
        body: data,
        auth: true,
      }),

    show: (id: number): Promise<Item> =>
      request<Item>({
        method: 'GET',
        route: `/api/v1/items/${id}`,
        auth: true,
      }).then((res) => parseItem(res.data!)),

    update: (id: number, data: Partial<Item>) =>
      request<Item>({
        method: 'PUT',
        route: `/api/v1/items/${id}`,
        body: data,
        auth: true,
      }),

    destroy: (id: number) =>
      request<void>({
        method: 'DELETE',
        route: `/api/v1/items/${id}`,
        auth: true,
      }),
  },
}
