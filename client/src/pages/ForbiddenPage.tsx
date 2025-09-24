import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ForbiddenPageProps {
  title?: string
  message?: string
  subtitle?: string
  redirectTo?: string
  redirectLabel?: string
}

const ForbiddenPage = ({
  title = '403 - Forbidden',
  message = "You don't have permission to access this page.",
  subtitle,
  redirectTo = '/',
  redirectLabel = 'Go to Dashboard',
}: ForbiddenPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          <div className="pt-4">
            <Link
              to={redirectTo}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {redirectLabel}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForbiddenPage
