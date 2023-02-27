import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { Home } from "../pages/Home";
import { Sale } from "../pages/Sale";
import { SalePerPeriod } from "../pages/SalePerPeriod";
import { UserRegistration } from "../pages/UserRegistration";
import IngresarInventario from "../pages/IngresarInventario";

export const RouteMain = () => {
  const { adminUser } = useSelector((state) => state.admin);
  // const IngresarInventario = lazy(() => import("../pages/IngresarInventario"));
  return (
    <>
      <Routes>
        {adminUser.token ? (
          <>
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/sale" element={<Sale />} />
            {adminUser.role === "Administrador" && (
              <Route path="/all-orders" element={<SalePerPeriod />} />
            )}
          </>
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          {(adminUser.role === "Administrador" && (
            <Route path="/feed_stock" element={<IngresarInventario />} />
          )) ||
            (adminUser.role === "Encargado" && (
              <Route path="/feed_stock" element={<IngresarInventario />} />
            ))}
        </Routes>
      </Suspense>
    </>
  );
};
