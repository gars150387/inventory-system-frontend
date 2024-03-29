import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useOrder } from "../../hooks/useOrder";
import { apiBase } from "../api/Api";
import ReactPaginate from "react-paginate";
import { ReceiptFormat } from "./ReceiptFormat";
import "../../style/component/paginate.css";

export const SelectItem = ({ search, salePerson }) => {
  const [receivedData, setReceivedData] = useState([]);
  const [addItem, setAddItem] = useState([]);
  console.log("🚀 ~ file: SelectItem.js:21 ~ SelectItem ~ addItem:", addItem);
  const { adminUser } = useSelector((state) => state.admin);
  const { newOrderCall, currentOrderProcessed, showReceipt } = useOrder();
  const [currentItemsRendered, setCurrentItemsRendered] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const { _id, clientName, order, time, total } = currentOrderProcessed;
  const dataMap = new Map();
  console.log("🚀 ~ file: SelectItem.js:30 ~ SelectItem ~ dataMap:", dataMap);

  const initialStock = useRef();
  for (let data of receivedData) {
    if (!dataMap.has(data._id)) {
      dataMap.set(data._id, data);
    }
  }
  useEffect(() => {
    const callApiInventoryResume = async () => {
      const response = await apiBase.get("/item/inventory");
      if (response) {
        setReceivedData(response.data.inventory);
      }
    };
    callApiInventoryResume();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItemsRendered(receivedData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(receivedData.length / itemsPerPage));
    initialStock.current = receivedData;
  }, [itemOffset, receivedData]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % receivedData.length;
    setItemOffset(newOffset);
  };

  const resultFound = receivedData.filter((item) =>
    item.resume.toLowerCase().includes(search.toLowerCase())
  );

  const addItemTocart = async (item) => {
    Swal.fire({
      title: `${item.name}, ${item.brand}`,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: `Agregar cantidad`
      },
      showCancelButton: true,
      confirmButtonText: "Agregar",
      showLoaderOnConfirm: true,
      preConfirm: async (quantity) => {
        if (quantity > item.quantity)
          return alert("No hay suficiente en existencia");
        if (quantity !== "") {
          const listOfItemAdded = [
            ...addItem,
            { ...item, quantity: parseInt(quantity) }
          ];
          if (listOfItemAdded.length > 0) {
            setAddItem(listOfItemAdded);
          }
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  };

  const handleDeleteItem = (_id) => {
    let itemDeleted = addItem.filter((item) => {
      return item._id !== _id;
    });
    if (itemDeleted) {
      setAddItem(itemDeleted);
    }
  };

  let totalToDisplay = 0;
  const sumPriceInOrder = async () => {
    const initalState = 0;
    let totalAccru = [];
    const accru = new Map();
    addItem?.map((item, index) => {
      return accru.set(index, item.price * item.quantity);
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
  let totalItemsInOrderToDisplay;
  const sumItemsInOrder = async () => {
    const initalState = 0;
    let totalItemAccru = [];
    const accru = new Map();
    addItem?.map((item, index) => {
      return accru.set(index, parseInt(item.quantity));
    });
    for (const value of accru.values()) {
      totalItemAccru.push(value);
    }
    return (totalItemsInOrderToDisplay = totalItemAccru.reduce(
      (acc, val) => acc + val,
      initalState
    ));
  };
  sumItemsInOrder();

  const modifyItemQuantityAfterOrder = async () => {
    for (let j = 0; j < addItem.length; j++) {
      console.log(
        "🚀 ~ file: SelectItem.js:138 ~ modifyItemQuantityAfterOrder ~ addItem:",
        addItem[j]
      );
      if (dataMap.has(addItem[j]._id)) {
        console.log(
          "🚀 ~ file: SelectItem.js:140 ~ modifyItemQuantityAfterOrder ~ addItem[j]._id:",
          addItem[j]._id
        );
        let total = dataMap.get(addItem[j]._id).quantity - addItem[j].quantity;
        console.log(
          "🚀 ~ file: SelectItem.js:144 ~ modifyItemQuantityAfterOrder ~ total:",
          total
        );

        apiBase.put(`/item/edit-item-quantity/${addItem[j]._id}`, {
          ...addItem[j]._id,
          quantity: total
        });
      }
    }
  };
  const handleProcessOrder = async () => {
    if (salePerson !== "") {
      Swal.fire({
        title: "Favor ingresar el nombre del cliente",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Procesar",
        showLoaderOnConfirm: true,
        preConfirm: async (cliente) => {
          try {
            modifyItemQuantityAfterOrder();
            setAddItem([]);
            await newOrderCall({
              cliente,
              addItem,
              totalToDisplay,
              salePerson
            });
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
          }
        }
      });
    } else {
      alert("Favor selecciona un vendedor antes de procesar la orden");
    }
  };
  return (
    <>
      {currentItemsRendered === null ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm">
            <caption>
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="active"
              />
            </caption>
            <thead className="table-dark">
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
              {search === ""
                ? currentItemsRendered?.map((item) => {
                    return (
                      <>
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>{item.brand}</td>
                          <td>{item.color}</td>
                          <td>{item.size}</td>
                          <td>{item.resume}</td>
                          <td>{item.quantity}</td>
                          {adminUser.role === "Administrador" && (
                            <td>{item.cost}</td>
                          )}
                          <td>{item.price}</td>
                          <td>
                            <button onClick={() => addItemTocart(item)}>
                              Agregar
                            </button>
                          </td>
                        </tr>
                      </>
                    );
                  })
                : resultFound?.map((item) => {
                    return (
                      <>
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>{item.brand}</td>
                          <td>{item.color}</td>
                          <td>{item.size}</td>
                          <td>{item.resume}</td>
                          <td>{item.quantity}</td>
                          {adminUser.role === "Administrador" && (
                            <td>{item.cost}</td>
                          )}
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
        </div>
      )}

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
            margin: " 0 auto"
          }}
        >
          <label>
            Productos: <strong>{addItem.length}</strong>
          </label>
          <label>
            Cantidad de articulos: <strong>{totalItemsInOrderToDisplay}</strong>
          </label>

          <label>
            Total a pagar: <strong>${totalToDisplay.toFixed(2)}</strong>
          </label>
          <button onClick={handleProcessOrder}>Procesar orden</button>
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
                    borderBottom: "dashed 1px #212529"
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
                      flexDirection: "column"
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
                      Total a pagar por item:{" "}
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
      <div className={`d-${showReceipt}`}>
        {currentOrderProcessed !== [] && (
          <ReceiptFormat
            _id={_id}
            clientName={clientName}
            order={order}
            salePerson={salePerson}
            time={time}
            total={total}
          />
        )}
      </div>
    </>
  );
};
