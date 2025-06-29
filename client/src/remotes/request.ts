import axios, { AxiosResponse } from 'axios'
import { baseURL } from './axios_defaults'

axios.defaults.baseURL = baseURL

export enum RequestMethods {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

interface RequestParams {
  method: keyof typeof RequestMethods
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
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  if (auth) {
    headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
  }

  try {
    if (optimistic) {
      optimistic(body)
    }

    const response: AxiosResponse = await axios.request({
      method,
      headers,
      url: route,
      data: body,
    })

    return response.data
  } catch (error: any) {
    if (rollback) rollback()

    let message = 'An error occurred'

    if (axios.isAxiosError(error)) {
      const status = error.response?.status

      switch (status) {
        case 401:
          message = 'invalid credentials'
          break
        case 404:
          message = 'The requested resource was not found.'
          break
        case 409:
          message = 'email already registered.'
          break
        default:
          message = error.response?.data?.message || 'Something went wrong.'
      }
    }

    return {
      error: true,
      message,
    }
  }
}
