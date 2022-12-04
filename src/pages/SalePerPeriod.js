import React, { useState, useEffect } from "react";
import { apiBase } from "../components/api/Api";
import { Pagination } from "../components/helper/Pagination";
import { CustomerFormat } from "../components/sale/CustomerFormat";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export const SalePerPeriod = () => {
  const [date, setDate] = useState(new Date());
  console.log("🚀 ~ file: SalePerPeriod.js:11 ~ SalePerPeriod ~ date", )
  const [allOrdersPlaced, setAllOrdersPlaced] = useState([]);
  const [orderId, setOrderId] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesRenderedPerPage] = useState(10);

  const indexOfLastSalesRendered = currentPage * salesRenderedPerPage;
  const indexOfFirstSalesRendered =
    indexOfLastSalesRendered - salesRenderedPerPage;
  const currentSalesRendered = allOrdersPlaced.slice(
    indexOfFirstSalesRendered,
    indexOfLastSalesRendered
  );

  const paginate = (pageNumbers) => {
    setCurrentPage(pageNumbers);
  };

  const callApiToRenderAllOrdersPlaced = async () => {
    const response = await apiBase.get("/item/all-orders");
    if (response) {
      setAllOrdersPlaced(response.data.findAllOrders);
    }
  };

  useEffect(() => {
    callApiToRenderAllOrdersPlaced();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        width: "95%",
        gap: "2%",
      }}
    >
      <div style={{ width: "60%", margin: "0 0% 0% 3%" }}>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Cliente</th>
              <th scope="col">Vendedor | ID</th>
              <th scope="col">total</th>
              <th scope="col">
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                />
              </th>
              <th scope="col">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {currentSalesRendered?.map((order, index) => {
            //  console.log(order[index].time < order[index++].time)
              return (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <th scope="col">{order.clientName}</th>
                  <th scope="col">{order.salePerson}</th>
                  <th scope="col">${order.total}</th>
                  <th scope="col">{order.time}</th>
                  <th scope="col">
                    <button onClick={() => setOrderId(order.order)}>
                      Detalle
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination
          childrenRenderedPerPage={salesRenderedPerPage}
          totalChildren={allOrdersPlaced.length}
          paginate={paginate}
        />
      </div>
      <div style={{ margin: "0% auto", borderLeft: "1px dashed #212529" }}>
        <CustomerFormat order={orderId} />
      </div>
    </div>
  );
};
