import React from "react";

export const CustomerFormat = (order) => {
  const details = Object.values(order);
  return (
    <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
      margin: "0 auto",
    }}>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Marca</th>
            <th scope="col">Color</th>
            <th scope="col">Tamano</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Precio</th>
          </tr>
        </thead>
        <tbody>
          {details !== []
            ? details[0]?.map((detail) => {
                return (
                    <tr key={detail._id}>
                      <td>{detail.name}</td>
                      <td>{detail.brand}</td>
                      <td>{detail.color}</td>
                      <td>{detail.size}</td>
                      <td>{detail.resume}</td>
                      <td>{detail.quantity}</td>
                      <td>{detail.price}</td>
                    </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
};
