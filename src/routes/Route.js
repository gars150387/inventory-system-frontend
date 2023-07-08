import React from "react";
import { Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { Home } from "../pages/Home";
import { SalePerPeriod } from "../pages/SalePerPeriod";
import { UserRegistration } from "../pages/UserRegistration";
import IngresarInventario from "../pages/IngresarInventario";
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
          </>
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
      <Routes>
        {(adminUser.role === "Administrador"  && (
          <>
            <Route path="/feed_stock" element={<IngresarInventario />} />{" "}
            <Route path="/inventario" element={<PaginaPrincipalInventario />} />{" "}
          </>
        )) ||
          (adminUser.role === "Encargado" && (
            <>
            <Route path="/feed_stock" element={<IngresarInventario />} />{" "}
            <Route path="/inventario" element={<PaginaPrincipalInventario />} />{" "}
          </>
          ))}
      </Routes>
    </>
  );
};
