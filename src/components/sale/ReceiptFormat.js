import React from "react";

export const ReceiptFormat = ({
  _id,
  clientName,
  order,
  salePerson,
  time,
  total,
}) => {
  return (
    <div
      className="container-receipt-submitted"
      style={{
        width: "70%",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        margin: " 2% auto",
        padding: "30px",
        border: " dashed 2px #212529",
        borderRadius: "15px",
      }}
    >
      <div
        className="container-receipt-submitted"
        style={{
          width: "98%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h6>
            Cliente: <label>{clientName}</label>
          </h6>
          <h6>
            Transaccion ID#: <label>{_id}</label>
          </h6>
        </div>

        <div>
          <h6>
            Vendedor: <label>{salePerson}</label>
          </h6>
          <h6>
            Fecha: <label>{time}</label>
          </h6>
        </div>
      </div>
      <div
        className="container-receipt-submitted"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h6>
            Total a pagar: <label>${total}</label>
          </h6>
        </div>
        <div></div>
      </div>
      <hr style={{width:"90%", margin:"2% auto"}}/>
      <div className="container-receipt-submitted" style={{ width: "98%" }}>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Descripcion</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((detail, index) => {
              return (
                <>
                  <tr key={detail._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{`${detail.name}, ${detail.brand} ${detail.color} ${detail.size} ${detail.resume}`}</td>
                    <td>{detail.quantity}</td>
                    <td>{detail.price}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
