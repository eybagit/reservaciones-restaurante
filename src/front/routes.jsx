import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import RestaurantesPage from "./features/restaurantes/pages/RestaurantesPage";
import ReservasPage from "./features/reservas/pages/ReservasPage";

/**
 * Layout principal con Navbar y Footer
 */
const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 bg-light">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

/**
 * Configuración de rutas de la aplicación
 */
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<RestaurantesPage />} />
      <Route path="/reservas" element={<ReservasPage />} />
    </Route>
  ),
  {
    basename: import.meta.env.VITE_BASENAME || "/"
  }
);