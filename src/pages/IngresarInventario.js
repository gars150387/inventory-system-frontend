import React, { useState } from "react";
import { FormatToFeedStock } from "../components/feedStock/FormatToFeedStock";
import { useInterval } from "interval-hooks";
import { useSelector } from "react-redux";
import { apiBase } from "../components/api/Api";
import { Pagination } from "../components/helper/Pagination";
import Swal from "sweetalert2";

export const IngresarInventario = () => {
  const [search, setSearch] = useState("");
  const [receivedData, setReceivedData] = useState([]);
  const { adminUser } = useSelector((state) => state.admin);
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

  useInterval(() => {
    callApiInventoryResume();
  }, 2_00);

  const handleEditQuantity = async (item) => {
    for (let i = 0; i < receivedData.length; i++) {
      if (receivedData[i]._id === item._id) {
        Swal.fire({
          title: `${item.name}, ${item.brand}`,
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
            placeholder: `Cantidad existente: ${item.quantity}`,
          },
          showCancelButton: true,
          confirmButtonText: "Guarda",
          showLoaderOnConfirm: true,
          preConfirm: async (quantity) => {
            apiBase.put(`/item/edit-item-quantity/${item._id}`, {
              ...item,
              quantity: quantity,
            });
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: `${item.name}, ${item.brand}`,
              text: "El inventario fue actualizado",
            });
          }
        });
      }
    }
  };
  return (
    <div>
      <div>
        <h4>IngresarInventario</h4>
      </div>
      <div>
        <FormatToFeedStock />
      </div>
      <div>
        <div
          style={{
            margin: "2% auto",
          }}
        >
          <div>
            <input
              placeholder="Buscar producto aca"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div
          style={{
            width: "75%",
            margin: "0 auto",
          }}
        >
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
                <th scope="col">Editar Cantidad</th>
                {adminUser.role === "Administrador" && (
                  <th scope="col">Eliminar Articulo</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentItemsRendered
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
                        {adminUser.role === "Administrador" && (
                          <td>{item.cost}</td>
                        )}
                        <td>{item.price}</td>
                        <td>
                          <p
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditQuantity(item)}
                          >
                            Editar
                          </p>
                        </td>
                        {adminUser.role === "Administrador" && (
                          <td>
                            <p
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEditQuantity(item)}
                            >
                              Eliminar
                            </p>
                          </td>
                        )}
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
          <Pagination
            childrenRenderedPerPage={itemsRenderedPerPage}
            totalChildren={receivedData.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};
