import { setupWorker } from 'msw/browser'
import { handlers } from '.'
import { forbidden } from './utils/responses'
import { delay, http } from 'msw'

// Add back the catch-all but make it API-specific
const catchAll = http.all(
  `${import.meta.env.VITE_API_BASE_URL}/*`,
  ({ request }) => {
    return forbidden(`unregistered API route: ${request.url}`)
  },
)

const GLOBAL_DELAY = 500
const globalDelay = http.all('*', async () => {
  await delay(GLOBAL_DELAY)
})

const worker = setupWorker(globalDelay, ...handlers, catchAll)

export async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') return

  return worker.start({
    onUnhandledRequest(request, print) {
      const url = new URL(request.url)

      // Only warn about your API endpoints (port 8000)
      if (url.hostname === 'localhost' && url.port === '8000') {
        print.warning()
        return
      }

      // Silently ignore everything else (Vite files, external URLs, etc.)
      return 'bypass'
    },
  })
}
