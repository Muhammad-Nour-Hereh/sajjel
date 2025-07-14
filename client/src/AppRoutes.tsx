import { Route, Routes } from 'react-router-dom'
import { UserRoutes } from './routes/UserRoutes'
import HomePage from './pages/HomePage'
import UserLayout from './layouts/UserLayout'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import GuestLayout from './layouts/GuestLayout'
import ForgetPasswordPage from './pages/ForgetPasswordPage'
import { GuestRoutes } from './routes/GuestRoutes'
import ItemsPage from './pages/ItemsPage'
import RootPage from './pages/RootPage'

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
      </Route>
    </Routes>
  )
}

export default AppRoutes
