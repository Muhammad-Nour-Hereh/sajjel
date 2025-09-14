import { mockRequest } from './mockRequest'
import { realRequest } from './realRequest'

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface RequestParams {
  method: keyof typeof HttpMethod
  route: string
  body?: any
  auth?: boolean
  optimistic?: (body: any) => void
  rollback?: () => void
}

export interface ResponseData<T = any> {
  success?: 'true' | 'false'
  error?: boolean
  message?: string
  data?: T
}

export const request = async <T = any>({
  method,
  route,
  body,
  auth = false,
  optimistic,
  rollback,
}: RequestParams): Promise<ResponseData<T>> => {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'

  const request = useMock ? mockRequest : realRequest

  return request({ method, route, body, auth, optimistic, rollback })
}
