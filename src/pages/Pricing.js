import React from "react";
import { TableFormat } from "../components/pricing/TableFormat";
import '../style/page/Pricing.css'

export const Pricing = () => {
  return (
    <div>
      <h1>Pricing</h1>
      <div>
        <input />
        <button>Revisar</button>
      </div>
      <div className="container-table-format">
        <TableFormat />
      </div>
    </div>
  );
};
