import { Route, Routes } from "react-router-dom";
import { UserRoutes } from "./routes/UserRoutes";
import HomePage from "./pages/HomePage";
import UserLayout from "./layouts/UserLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path={UserRoutes.HOME} element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
