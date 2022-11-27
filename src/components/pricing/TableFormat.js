import React from "react";

export const TableFormat = () => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <th>@mdo</th>
        </tr>
      </tbody>
    </table>
  );
};
