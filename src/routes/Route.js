import React from "react";
import { Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { Register } from "../authentication/Register";
import { Home } from "../pages/Home";
import { Sale } from "../pages/Sale";
import { IngresarInventario } from "../pages/IngresarInventario";
import { SalePerPeriod } from "../pages/SalePerPeriod";

export const RouteMain = () => {
  const { adminUser } = useSelector((state) => state.admin);
  return (
    <Routes>
      {adminUser.token ? (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/register/:id" element={<Register />} />
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
