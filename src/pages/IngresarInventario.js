import React, { useEffect, useState } from "react";
import { FormatToFeedStock } from "../components/feedStock/FormatToFeedStock";
import { useSelector } from "react-redux";
import { apiBase } from "../components/api/Api";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { EditItemModal } from "../components/ui/EditItemModal";
import "../style/component/paginate.css";

const IngresarInventario = () => {
  const [search, setSearch] = useState("");
  const [receivedData, setReceivedData] = useState([]);
  const [modalState, setModalState] = useState(false);
  const [itemInfoToModal, setItemInfoToModal] = useState("");
  const { adminUser } = useSelector((state) => state.admin);
  const [currentItemsRendered, setCurrentItemsRendered] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  const callApiInventoryResume = async () => {
    const response = await apiBase.get("/item/inventory");
    if (response) {
      setReceivedData(response.data.inventory);
    }
  };

  useEffect(() => {
    callApiInventoryResume();
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItemsRendered(receivedData.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(receivedData.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, receivedData]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % receivedData.length;
    setItemOffset(newOffset);
  };

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

  const handleEditItem = async (item) => {
    setModalState(true);
    setItemInfoToModal(item);
  };

  const handleDeleteItem = async (item) => {
    for (let i = 0; i < receivedData.length; i++) {
      if (receivedData[i]._id === item._id) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });

        swalWithBootstrapButtons
          .fire({
            title: "Esta seguro?",
            text: "No se puede revertir esta accion despues de ejecutarse!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, proceder!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              const response = await apiBase.delete(
                `/item/delete-item/${receivedData[i]._id}`
              );
              if (response) {
                swalWithBootstrapButtons.fire(
                  "Deleted!",
                  "Your file has been deleted.",
                  "success"
                );
              }
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                "Cancelled",
                "La accion fue cancelada",
                "error"
              );
            }
          });
      }
    }
  };

  return (
    <div>
      <div>
        <h4>Ingresar Inventario</h4>
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
        {currentItemsRendered === null ? (
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : (
          <div
            style={{ width: "95%", margin: "0 auto" }}
            className="table-responsive"
          >
            <table className="table table-sm">
              <caption>
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
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
                  {adminUser.role === "Administrador" && (
                    <th scope="col">Accion</th>
                  )}
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
                {receivedData
                  ?.filter((item) =>
                    item.resume.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item) => {
                    return (
                      <>
                        <tr key={item._id}>
                          {adminUser.role === "Administrador" && (
                            <td>
                              <p
                                style={{ cursor: "pointer" }}
                                onClick={() => handleEditItem(item)}
                              >
                                Editar Item
                              </p>
                            </td>
                          )}

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
                                onClick={() => handleDeleteItem(item)}
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
          </div>
        )}
      </div>
      <EditItemModal
        itemInfoToModal={itemInfoToModal}
        modalState={modalState}
        setModalState={setModalState}
      />
    </div>
  );
};

export default IngresarInventario;
