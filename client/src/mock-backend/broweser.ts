import { setupWorker } from 'msw/browser'
import { handlers } from '.'
import { forbidden } from './utils/responses'
import { http } from 'msw'

// You can optionally add a global catch-all here AFTER your handlers:
const catchAll = http.all('*', () => forbidden())

export const worker = setupWorker(...handlers, catchAll)
