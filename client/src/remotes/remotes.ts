import { Item } from '@/models/Item'
import { request, HttpMethod } from './request'
import { Sale } from '@/models/Sale'
import { SaleDTO } from '@/dto models/SaleDTO'

export const remote = {
  // Auth APIs:
  auth: {
    register: (name: string, email: string, password: string) =>
      request<string>({
        method: HttpMethod.POST,
        route: '/auth/register',
        body: { name, email, password },
      }),

    login: (email: string, password: string) =>
      request<string>({
        method: HttpMethod.POST,
        route: '/auth/login',
        body: { email, password },
      }),

    me: () =>
      request<string>({
        method: HttpMethod.GET,
        route: '/auth/me',
        auth: true,
      }),

    logout: () =>
      request({
        method: HttpMethod.POST,
        route: '/auth/logout',
        auth: true,
      }),
  },
  // Item APIs:
  items: {
    fetchAll: (): Promise<Item[]> =>
      request<Item[]>({
        method: HttpMethod.GET,
        route: '/items',
        auth: true,
      }).then((res) => res.data!),

    store: (data: FormData) =>
      request<Item>({
        method: HttpMethod.POST,
        route: '/items',
        body: data,
        auth: true,
      }),

    show: (id: number): Promise<Item> =>
      request<Item>({
        method: HttpMethod.GET,
        route: `/items/${id}`,
        auth: true,
      }).then((res) => res.data!),

    update: (id: number, data: Item) =>
      request<Item>({
        method: HttpMethod.PUT,
        route: `/items/${id}`,
        body: data,
        auth: true,
      }),

    updateThumbnail: (id: number, data: FormData) => {
      return request<{ thumbnail: string }>({
        method: HttpMethod.PATCH,
        route: `/items/${id}/update-thumbnail`,
        body: data,
        auth: true,
      })
    },

    destroy: (id: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: `/items/${id}`,
        auth: true,
      }),
  },
  // Sales APIs:
  sales: {
    fetchAll: (start?: string, end?: string): Promise<Sale[]> =>
      request<Sale[]>({
        method: HttpMethod.GET,
        route: `/sales?start_date=${start}&end_date=${end}`,
        auth: true,
      }).then((res) => res.data!),

    store: (data: SaleDTO) =>
      request<Sale>({
        method: HttpMethod.POST,
        route: '/sales',
        body: data,
        auth: true,
      }),

    show: (id: number): Promise<Sale> =>
      request<Sale>({
        method: HttpMethod.GET,
        route: `/sales/${id}`,
        auth: true,
      }).then((res) => res.data!),

    update: (id: number, data: Partial<Sale>) =>
      request<Sale>({
        method: HttpMethod.PUT,
        route: `/sales/${id}`,
        body: data,
        auth: true,
      }),

    destroy: (id: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: `/sales/${id}`,
        auth: true,
      }),
  },
}
