import React from "react";

export const RoleDescription = () => {
  return (
    <div style={{ width: "20%" }}>
      <div>
        <h6 style={{textDecoration:"underline"}}>Administrador</h6>
        Funciones permitidas:{" "}
        <ul style={{ width:"90%", display:"flex", justifyContent:"flex-start", alignContent:"center", flexDirection:"column"}}>
          <span><i className="bi bi-arrow-right" />Editar articulo</span>
          <span><i className="bi bi-arrow-right" />Editar cantidad</span>
          <span><i className="bi bi-arrow-right" />Eminiar articulo</span>
          <span><i className="bi bi-arrow-right" />Crear usuario</span>
          <span><i className="bi bi-arrow-right" />Editar permiso de usuario</span>
          <span><i className="bi bi-arrow-right" />Costos mostrados</span>
          <span><i className="bi bi-arrow-right" />Total de ventas</span>
          <span><i className="bi bi-arrow-right" />Procesar venta</span>
        </ul>
      </div>
      <div>
        <h6 style={{textDecoration:"underline"}}>Encargado</h6>
        Funciones permitidas:
        <ul style={{ width:"90%", display:"flex", justifyContent:"flex-start", alignContent:"center", flexDirection:"column"}}>
          <span><i className="bi bi-arrow-right" />Editar cantidad</span>
          <span><i className="bi bi-arrow-right" />Procesar venta</span>
        </ul>
      </div>
      <div>
        <h6 style={{textDecoration:"underline"}}>Vendedor</h6>
        <span><i className="bi bi-arrow-right" />Procesar venta</span>
      </div>
    </div>
  );
};
