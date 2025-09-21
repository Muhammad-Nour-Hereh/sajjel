import { Route, Routes } from 'react-router-dom'
// layouts
import GuestLayout from './layouts/GuestLayout'
import UserLayout from './layouts/UserLayout'
import DevLayout from './layouts/DevLayout'
// routes
import GuestRoutes from './routes/GuestRoutes'
import UserRoutes from './routes/UserRoutes'
import DevRoutes from './routes/DevRoutes'
// pages
import RegisterPage from './features/auth/pages/RegisterPage'
import LoginPage from './features/auth/pages/LoginPage'
import ForgetPasswordPage from './features/auth/pages/ForgetPasswordPage'
import ItemsPage from './features/items/pages/ItemsPage'
import RootPage from './pages/RootPage'
import SalesPage from './features/sales/pages/SalesPage'
import HomePage from './features/home/pages/HomePage'
import ComponentsPage from './pages/ComponentsPage'
import CategoriesPage from './features/category/pages/CategoriesPage'
import AdminLayout from './layouts/AdminLayout'
import AdminRoutes from './routes/AdminRoutes'

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
        <Route path={UserRoutes.CATEGORIES} element={<CategoriesPage />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path={AdminRoutes.USERS_MANAGMENT} element={null} />
      </Route>
      <Route element={<DevLayout />}>
        <Route path={DevRoutes.COMPONENTS} element={<ComponentsPage />}></Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
