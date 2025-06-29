import { Route, Routes } from "react-router-dom";
import { UserRoutes } from "./routes/UserRoutes";
import HomePage from "./pages/HomePage";
import UserLayout from "./layouts/UserLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path={UserRoutes.HOME} element={<HomePage />} />
        <Route path={UserRoutes.REGISTER} element={<RegisterPage />} />
        <Route path={UserRoutes.LOGIN} element={<LoginPage/>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
