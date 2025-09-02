import { Route, Routes } from 'react-router-dom'
import { UserRoutes } from './routes/UserRoutes'
import UserLayout from './layouts/UserLayout'
import RegisterPage from './features/auth/pages/RegisterPage'
import LoginPage from './features/auth/pages/LoginPage'
import GuestLayout from './layouts/GuestLayout'
import ForgetPasswordPage from './features/auth/pages/ForgetPasswordPage'
import { GuestRoutes } from './routes/GuestRoutes'
import ItemsPage from './features/items/pages/ItemsPage'
import RootPage from './pages/RootPage'
import SalesPage from './features/sales/pages/SalesPage'
import HomePage from './features/home/pages/HomePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path={GuestRoutes.REGISTER} element={<RegisterPage />} />
        <Route path={GuestRoutes.LOGIN} element={<LoginPage />} />
        <Route
          path={GuestRoutes.FORGETPASSWORD}
          element={<ForgetPasswordPage />}
        />
      </Route>
      <Route element={<UserLayout />}>
        <Route path={UserRoutes.ROOT} element={<RootPage />} />
        <Route path={UserRoutes.HOME} element={<HomePage />} />
        <Route path={UserRoutes.ITEMS} element={<ItemsPage />} />
        <Route path={UserRoutes.SALES} element={<SalesPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
