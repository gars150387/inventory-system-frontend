import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { apiBase } from "../api/Api";

export const SelectItem = ({ search }) => {
  const [receivedData, setReceivedData] = useState([]);
  const [addItem, setAddItem] = useState([]);
  const [statusDisplayInput, setStatusDisplayInput] = useState(false);
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

  const selectIndividualQuantity = async (_id) => {
    let select = "";

    if (_id) {
      console.log(
        "🚀 ~ file: SelectItem.js ~ line 29 ~ selectIndividualQuantity ~ _id",
        _id
      );
      addItem?.map((item) => {
        return {
          ...item,
          quantitySelected:
            item._id === _id
              ? setStatusDisplayInput(true)
              : setStatusDisplayInput(false),
        };
      });
    }
  };
  const handleSubmitOrder = async (qty) => {};
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
          {receivedData?.filter((item) =>
        item.resume.toLowerCase().includes(search.toLowerCase())
           ).map((item) => {
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
                    <button onClick={() => addItemTocart(item)}>Agregar</button>
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
        <div
          style={{
            width: "55%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: " 0 auto",
          }}
        >
          <label>
            Cantidad de productos #: <strong>{addItem.length}</strong>
          </label>
          <button onClick={handleSubmitOrder}>Procesar orden</button>
        </div>
        {addItem?.map(({ _id, name, brand, size, color, resume, price }) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "98%",
                  height: "13vh",
                  margin: "1% auto",
                  borderTop: "dashed 1px #212529",
                  borderBottom: "dashed 1px #212529",
                }}
                key={_id}
              >
                <div style={{ width: "14%", margin: "0 2%" }}>
                  <label>
                    Nombre: <strong>{name}</strong>
                  </label>
                </div>
                <div style={{ width: "14%", margin: "0 2%" }}>
                  <label>
                    Marca: <strong>{brand}</strong>
                  </label>
                </div>
                <div style={{ width: "14%", margin: "0 2%" }}>
                  <label>
                    Color: <strong>{color}</strong>
                  </label>
                </div>
                <div style={{ width: "14%", margin: "0 2%" }}>
                  <label>
                    Tamano: <strong>{size}</strong>
                  </label>
                </div>
                <div
                  style={{
                    width: "14%",
                    margin: "0 2%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <label>
                    Descripcion:
                    <p>
                      <strong>{resume}</strong>
                    </p>
                  </label>
                </div>
                <div style={{ width: "14%", margin: "0 2%" }}>
                  <label>
                    Precio: <strong>($){price}</strong>
                  </label>
                </div>
                {/* <div style={{ width: "14%", margin: "0 2%" }}>
                  <label>
                    Precio: <strong>($){price * qty}</strong>
                  </label>
                </div> */}
                <div
                  style={{
                    width: "14%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button onClick={() => selectIndividualQuantity(_id)}>
                    Agregar cantidad
                  </button>

                  {statusDisplayInput === true ? (
                    <input
                      // value={qty}
                      name=""
                      // onChange={(event) => setQty(event.target.value)}
                      placeholder="Qty"
                      style={{ width: "30%" }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
