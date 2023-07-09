import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { Home } from "../pages/Home";
import { SalePerPeriod } from "../pages/SalePerPeriod";
import { UserRegistration } from "../pages/UserRegistration";
import PaginaPrincipalVentas from "../pages/PaginaPrincipalVentas";
import PaginaPrincipalInventario from "../pages/PaginaPrincipalInventario";

export const RouteMain = () => {
  const { adminUser } = useSelector((state) => state.admin);
  return (
    <>
      <Routes>
        {adminUser.token ? (
          <>
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/ventas" element={<PaginaPrincipalVentas />} />
            {adminUser.role === "Administrador" && (
              <Route path="/all-orders" element={<SalePerPeriod />} />
            )}
            {adminUser.role === "Administrador" && (
              <>
                <Route
                  path="/inventario"
                  element={<PaginaPrincipalInventario />}
                />{" "}
              </>
            )}
            {adminUser.role === "Encargado" && (
              <>
                <Route
                  path="/inventario"
                  element={<PaginaPrincipalInventario />}
                />{" "}
              </>
            )}
            <Route path="/*" element={<Navigate to="/ventas" replace />} />
          </>
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
    </>
  );
};
