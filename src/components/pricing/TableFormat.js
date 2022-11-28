import { useInterval } from "interval-hooks";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { apiBase } from "../api/Api";

export const TableFormat = ({search}) => {
  const [receivedData, setReceivedData] = useState([]);
  const { adminUser } = useSelector( state => state.admin)
  const callApiInventoryResume = async () => {
    const response = await apiBase.get("/item/inventory");
    if (response) {
      setReceivedData(response.data.inventory);
    }
  };      

  useInterval(() => {
    callApiInventoryResume();
  }, 2_00);

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Marca</th>
          <th scope="col">Color</th>
          <th scope="col">Tamano</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Disponible (Unidades)</th>
          {adminUser.role === "Administrador" && <th scope="col">Costo ($)</th>}
          <th scope="col">Precio ($)</th>
        </tr>
      </thead>
      <tbody>
        {receivedData?.filter(item => item.resume.toLowerCase().includes( search.toLowerCase() )).map((item) => {
          return (
            <>
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.brand}</td>
                <td>{item.color}</td>
                <td>{item.size}</td>
                <td>{item.resume}</td>
                <td>{item.quantity}</td>
                {adminUser.role === "Administrador" && <td>{item.cost}</td>}
                <td>{item.price}</td>
                </tr>
            </>
          );
        })}
      </tbody>
      
    </table>
  );
};
