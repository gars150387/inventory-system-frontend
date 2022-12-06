import React from "react";
import { Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { Home } from "../pages/Home";
import { Sale } from "../pages/Sale";
import { IngresarInventario } from "../pages/IngresarInventario";
import { SalePerPeriod } from "../pages/SalePerPeriod";
import { UserRegistration } from "../pages/UserRegistration";

export const RouteMain = () => {
  const { adminUser } = useSelector((state) => state.admin);
  return (
    <Routes>
      {adminUser.token ? (
        <>
          <Route path="/register" element={<UserRegistration />} />
          <Route path="/sale" element={<Sale />} />
          {adminUser.role === "Administrador" && (
            <Route path="/all-orders" element={<SalePerPeriod />} />
          )}
          {adminUser.role === "Administrador" ||
          adminUser.role === "Encargado" ? (
            <Route path="/feed_stock" element={<IngresarInventario />} />
          ) : null}
        </>
      ) : (
        <Route path="/" element={<Home />} />
      )}
    </Routes>
  );
};
