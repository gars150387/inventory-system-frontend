import React, { useState, useEffect } from "react";
import { apiBase } from "../components/api/Api";
import ReactPaginate from "react-paginate";
import { CustomerFormat } from "../components/sale/CustomerFormat";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useInterval } from "interval-hooks";

export const SalePerPeriod = () => {
  const [date, setDate] = useState(new Date());
  console.log("🚀 ~ file: SalePerPeriod.js:11 ~ SalePerPeriod ~ date");
  const [allOrdersPlaced, setAllOrdersPlaced] = useState([]);
  const [orderId, setOrderId] = useState([]);
  ///
  const [currentItemsRendered, setCurrentItemsRendered] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  const callApiToRenderAllOrdersPlaced = async () => {
    const response = await apiBase.get("/item/all-orders");
    if (response) {
      setAllOrdersPlaced(response.data.findAllOrders);
    }
  };
  useEffect(() => {
    callApiToRenderAllOrdersPlaced();
  }, [itemOffset, itemsPerPage, allOrdersPlaced])
  

  useInterval(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItemsRendered(allOrdersPlaced.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(allOrdersPlaced.length / itemsPerPage));
  }, 2_00);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % allOrdersPlaced.length;
    setItemOffset(newOffset);
  };

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
            {currentItemsRendered?.map((order, index) => {
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
      </div>
      <div style={{ margin: "0% auto", borderLeft: "1px dashed #212529" }}>
        <CustomerFormat order={orderId} />
      </div>
    </div>
  );
};
