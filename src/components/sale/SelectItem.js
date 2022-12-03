import { useInterval } from "interval-hooks";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useOrder } from "../../hooks/useOrder";
import { apiBase } from "../api/Api";
import { Pagination } from "../helper/Pagination";

let objItem = {
  name: "",
  brand: "",
  color: "",
  size: "",
  resume: "",
  quantity: "",
};
export const SelectItem = ({ search, salePerson }) => {
  console.log("🚀 ~ file: SelectItem.js:19 ~ SelectItem ~ salePerson", salePerson)
  const [receivedData, setReceivedData] = useState([]);
  const [addItem, setAddItem] = useState([]);
  const [quantitySelected, setQuantitySelected] = useState("");
  const { adminUser } = useSelector((state) => state.admin);
  const { newOrderCall } = useOrder();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsRenderedPerPage] = useState(10);

  const indexOfLastItemsRendered = currentPage * itemsRenderedPerPage;
  const indexOfFirstItemsRendered =
    indexOfLastItemsRendered - itemsRenderedPerPage;
  const currentItemsRendered = receivedData.slice(
    indexOfFirstItemsRendered,
    indexOfLastItemsRendered
  );

  const paginate = (pageNumbers) => {
    setCurrentPage(pageNumbers);
  };

  const callApiInventoryResume = async () => {
    const response = await apiBase.get("/item/inventory");
    if (response) {
      setReceivedData(response.data.inventory);
    }
  };
  useEffect(() => {
    callApiInventoryResume();
  }, []);

  const initialStock = useRef();
  useInterval(() => {
    callApiInventoryResume();
    if (addItem.length !== initialStock.length) {
      initialStock.current = receivedData;
    }
  }, 5_00);

  const addItemTocart = async (item) => {
    if (quantitySelected > item.quantity)
      return alert("No hay suficiente en existencia");
    objItem = item;
    objItem.quantity = quantitySelected;
    if (objItem.quantity !== "") {
      const listOfItemAdded = [...addItem, objItem];
      if (listOfItemAdded !== []) {
        setAddItem(listOfItemAdded);
        setQuantitySelected("");
      }
    }
  };

  const handleDeleteItem = (_id) => {
    let itemDeleted = addItem.filter((item) => {
      return item._id !== _id;
    });
    if (itemDeleted) {
      setAddItem(itemDeleted);
    }
  };

  let totalToDisplay;
  const sumPriceInOrder = async () => {
    const initalState = 0;
    let totalAccru = [];
    const accru = new Map();
    addItem?.map((item, index) => {
      accru.set(index, item.price * item.quantity);
    });
    for (const value of accru.values()) {
      totalAccru.push(value);
    }
    return (totalToDisplay = totalAccru.reduce(
      (acc, val) => acc + val,
      initalState
    ));
  };
  sumPriceInOrder();

  const modifyItemQuantityAfterOrder = async () => {
    let referenceData = initialStock.current;
    addItem?.map((item) => {
      for (let i = 0; i < referenceData.length; i++) {
        if (item._id === referenceData[i]._id) {
          let total = referenceData[i].quantity - item.quantity;
          apiBase.put(`/item/edit-item-quantity/${item._id}`, {
            ...receivedData[i],
            quantity: total,
          });
        }
      }
    });
  };
  const handleProcessOrder = async () => {
    Swal.fire({
      title: "Favor ingresar el nombre del cliente",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Procesar",
      showLoaderOnConfirm: true,
      preConfirm: async (cliente) => {
        try {
          await newOrderCall({ cliente, addItem, totalToDisplay, salePerson });
          await modifyItemQuantityAfterOrder();
          setAddItem([]);
          navigate(`/receipt`);
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
    });
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
            <th scope="col">Cantidad</th>
            <th scope="col">Vender</th>
          </tr>
        </thead>
        <tbody>
          {currentItemsRendered
            ?.filter((item) => item.resume.includes(search))
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
                      <input
                        style={{
                          width: "20%",
                          padding: "1px",
                        }}
                        placeholder="Qty"
                        name="quantitySelected"
                        value={quantitySelected}
                        onChange={(event) =>
                          setQuantitySelected(event.target.value)
                        }
                      />
                    </td>
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
        <Pagination
          childrenRenderedPerPage={itemsRenderedPerPage}
          totalChildren={receivedData.length}
          paginate={paginate}
        />
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
          <button onClick={handleProcessOrder}>Procesar orden</button>
          <label>
            Total a pagar en orden: <strong>${totalToDisplay}</strong>
          </label>
        </div>
        {addItem?.map(
          ({ _id, name, brand, size, color, resume, price, quantity }) => {
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
                  <div style={{ width: "5%", margin: "0 2%" }}>
                    <label>
                      Nombre: <strong>{name}</strong>
                    </label>
                  </div>
                  <div style={{ width: "5%", margin: "0 2%" }}>
                    <label>
                      Marca: <strong>{brand}</strong>
                    </label>
                  </div>
                  <div style={{ width: "5%", margin: "0 2%" }}>
                    <label>
                      Color: <strong>{color}</strong>
                    </label>
                  </div>
                  <div style={{ width: "5%", margin: "0 2%" }}>
                    <label>
                      Tamano: <strong>{size}</strong>
                    </label>
                  </div>
                  <div
                    style={{
                      width: "25%",
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
                  <div style={{ width: "5%", margin: "0 2%" }}>
                    <label>
                      Precio Unitario <strong>($){price}</strong>
                    </label>
                  </div>
                  <div style={{ width: "5%", margin: "0 2%" }}>
                    <label>
                      Cantidad seleccionada: <strong>{quantity}</strong>
                    </label>
                    <strong>
                      <i className="bi bi-pencil-square" />
                    </strong>
                  </div>
                  <div style={{ width: "5%", margin: "0 2%" }}>
                    <label>
                      responseId Total a pagar por item:{" "}
                      <strong>($){price * parseInt(quantity)}</strong>
                    </label>
                  </div>
                  <div style={{ width: "2%", margin: "0 2%", color: "#000" }}>
                    <button onClick={() => handleDeleteItem(_id)}>
                      Eliminar
                      <i
                        style={{ color: "#212529" }}
                        className="bi bi-trash3"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </>
  );
};
