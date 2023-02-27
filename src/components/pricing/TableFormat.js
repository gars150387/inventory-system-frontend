// import { useInterval } from "interval-hooks";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiBase } from "../api/Api";
import { Pagination } from "../helper/Pagination";

export const TableFormat = ({ search }) => {
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

  useEffect(() => {
    callApiInventoryResume();
  }, []);

  return (
    <div>
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
                    {adminUser.role === "Administrador" && <td>{item.cost}</td>}
                    <td>{item.price}</td>
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
  );
};
