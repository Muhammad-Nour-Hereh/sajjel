import { HttpMethod, ResponseData, RequestParams } from './request'

export const mockRequest = async <T = any>({
  method,
  route,
  body,
}: RequestParams): Promise<ResponseData<T>> => {
  return { error: true, message: `No mock implemented for ${method} ${route}` }
}
