import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiBase } from "../api/Api";
import { Order } from "./Order";

export const SelectItem = ({ search, qty }) => {
  const [receivedData, setReceivedData] = useState([]);
  console.log(
    "🚀 ~ file: SelectItem.js ~ line 8 ~ SelectItem ~ receivedData",
    receivedData
  );
  const [quantitySelected, setQuantitySelected] = useState("");
  const [addItem, setAddItem] = useState([]);
  console.log(
    "🚀 ~ file: SelectItem.js ~ line 10 ~ SelectItem ~ addItem",
    addItem
  );
  const { adminUser } = useSelector((state) => state.admin);
  const callApiInventoryResume = async () => {
    const response = await apiBase.get("/item/inventory");
    if (response) {
      setReceivedData(response.data.inventory);
    }
  };
  useEffect(() => {
    callApiInventoryResume();
  }, []);

  const addItemTocart = async (item) => {
    const listOfItemAdded = [...addItem, item];
    if (listOfItemAdded !== []) {
      setAddItem(listOfItemAdded);
    }
  };
  return (
    <>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Marca</th>
            <th scope="col">Color</th>
            <th scope="col">Tamano</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Disponible (Unidades)</th>
            {adminUser.role === "Administrador" && (
              <th scope="col">Costo ($)</th>
            )}
            <th scope="col">Precio ($)</th>
            <th scope="col">Vender</th>
          </tr>
        </thead>
        <tbody>
          {receivedData
            ?.filter((item) =>
              item.resume.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => {
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
                    <td>
                      <button onClick={() => addItemTocart(item)}>
                        Agregar
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
      <div>
        <h5>Orden en progreso</h5>
      </div>
      <div>
        <div>
          <label>Cantidad de productos #: {addItem.length}</label>
        </div>
        {addItem?.map(({ _id, name, brand, size, color, resume, price }) => {
          return (
            <div>
              <Order
                _id={_id}
                name={name}
                brand={brand}
                size={size}
                color={color}
                resume={resume}
                price={price}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
