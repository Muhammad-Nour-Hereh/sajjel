import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} position="top" />
    </QueryClientProvider>
  )
}

export default App
