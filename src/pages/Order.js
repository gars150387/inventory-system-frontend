import React, { useEffect, useState } from "react";
import { apiBase } from "../components/api/Api";
import { useOrder } from "../hooks/useOrder";

export const Order = () => {
 

  return (
    <div>
      <div>Order</div>
      <div>
        {/* {displayDetailCurrentOrder !== []
          ? displayDetailCurrentOrder.map((detail) => {
              return (
                <>
                  <div>
                    <label>Cliente: </label>
                    <span>{detail.clientName}</span>
                  </div>
                  <div>
                    <label>Fecha: </label>
                    <span>{detail.time}</span>
                  </div>
                  <div>
                    <label>Vendedor: </label>
                    <span>{detail.salePerson}</span>
                  </div>
                  <div>
                    <label>Total: </label>
                    <span>${detail.total}</span>
                  </div>
                  <div>
                    <label>Productos: </label>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">Producto</th>
                          <th scope="col">Marca</th>
                          <th scope="col">Color</th>
                          <th scope="col">Tamano</th>
                          <th scope="col">Descripcion</th>
                          <th scope="col">Precio ($)</th>
                          <th scope="col">Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.order?.map((item) => {
                          return (
                            <>
                              <tr>
                                <th>{item.name}</th>
                                <th>{item.brand}</th>
                                <th>{item.color}</th>
                                <th>{item.size}</th>
                                <th>{item.resume}</th>
                                <th>{item.price}</th>
                                <th>{item.quantity}</th>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })
          : null} */}
      </div>
    </div>
  );
};
