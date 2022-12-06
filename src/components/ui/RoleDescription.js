import React from "react";

export const RoleDescription = () => {
  return (
    <div style={{ width: "20%" }}>
      <div>
        <h6>Administrador</h6>
        Funciones permitidas:{" "}
        <ul>
          <li>Editar articulo</li>
          <li>Editar cantidad</li>
          <li>Eminiar articulo</li>
          <li>Crear usuario</li>
          <li>Editar permiso de usuario</li>
          <li>Costos mostrados</li>
          <li>Total de ventas</li>
          <li>Procesar venta</li>
        </ul>
      </div>
      <div>
        <h6>Encargado</h6>
        Funciones permitidas:
        <ul>
          <li>Editar cantidad</li>
          <li>Procesar venta</li>
        </ul>
      </div>
      <div>
        <h6>Vendedor</h6>
        <li>Procesar venta</li>
      </div>
    </div>
  );
};
