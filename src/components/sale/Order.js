import React, { useState } from "react";
import { SelectItem } from "./SelectItem";

export const Order = ({ _id, name, brand, size, color, resume, price }) => {
  const [qty, setQty] = useState("");

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
          height: "10vh",
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
        <div style={{ width: "14%", margin: "0 2%" }}>
          <label>
            Descripcion: <strong>{resume}</strong>
          </label>
        </div>
        <div style={{ width: "14%", margin: "0 2%" }}>
          <label>
            Precio: <strong>($){price}</strong>
          </label>
        </div>
        <div
          style={{
            width: "14%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            value={qty}
            name=""
            onChange={(event) => setQty(event.target.value)}
            placeholder="Qty"
            style={{ width: "30%" }}
          />
        </div>
        <div style={{ width: "14%", margin: "0 2%" }}>
          <label>
            Precio: <strong>($){price * qty}</strong>
          </label>
        </div>
      </div>
      {/* <div className="d-none">
        <SelectItem qty={qty} />
      </div> */}
    </>
  );
};
