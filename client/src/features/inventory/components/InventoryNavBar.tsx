import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, Warehouse, Bell } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Items',
    href: '/items',
    icon: Package,
  },
  {
    title: 'Storages',
    href: '/storages',
    icon: Warehouse,
  },
  {
    title: 'Alerts',
    href: '/alerts',
    icon: Bell,
    showBadge: true,
  },
]

const InventoryNavBar = ({
  page,
  setPage,
}: {
  page: string
  setPage: Function
}) => {
  const [alertCount] = useState(0)

  //   useEffect(() => {
  //     const updateAlertCount = () => {
  //     //   const alerts = getAlerts().filter((alert) => !alert.acknowledged)
  //     //   setAlertCount(alerts.length)
  //     }

  //     updateAlertCount()
  //     const interval = setInterval(updateAlertCount, 5000)

  //     return () => clearInterval(interval)
  //   }, [])

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <span className="font-bold text-lg">Inventory System</span>
            </div>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const isActive = item.title === page
                return (
                  <div
                    key={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                    onClick={() => {
                      setPage(item.title)
                    }}>
                    <item.icon className="h-4 w-4" />
                    {item.title}
                    {item.showBadge && alertCount > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                        {alertCount}
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default InventoryNavBar
