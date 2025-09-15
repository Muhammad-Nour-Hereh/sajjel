// src/mock-backend/utils.ts
import { HttpResponse } from 'msw'
import type { ResponseData } from '@/http/request'

/** ---- Response helpers mirroring your Laravel ResponseTrait ---- */
const ok = <T>(data: T, status = 200) =>
  HttpResponse.json<ResponseData<T>>({ success: 'true', data }, { status })

const created = <T>(data: T, message = 'the has been created successfully') =>
  HttpResponse.json<ResponseData<T>>(
    { success: 'true', message, data },
    { status: 201 },
  )

const noContent = () => new HttpResponse(null, { status: 204 })

const fail = (message: string, status = 400) =>
  HttpResponse.json<ResponseData>(
    { success: 'false', message, data: null },
    { status },
  )

const unauthorized = () =>
  HttpResponse.json<ResponseData>(
    { success: 'false', message: 'Unauthorized', data: null },
    { status: 401 },
  )

const forbidden = () =>
  HttpResponse.json<ResponseData>(
    { success: 'false', message: 'Forbidden', data: null },
    { status: 403 },
  )

const notFound = () =>
  HttpResponse.json<ResponseData>(
    { success: 'false', message: 'not found', data: null },
    { status: 404 },
  )

const conflict = (errors: string) =>
  HttpResponse.json<ResponseData>(
    { success: 'false', message: errors, data: null },
    { status: 409 },
  )

const unprocessable = (error: string) =>
  HttpResponse.json<ResponseData>(
    { success: 'false', message: error, data: null },
    { status: 422 },
  )

export {
  ok,
  created,
  noContent,
  fail,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  unprocessable,
}
