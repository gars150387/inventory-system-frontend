import React, { useState } from "react";
import { TableFormat } from "../components/pricing/TableFormat";
import '../style/page/Pricing.css'

export const Pricing = () => {
  const [search, setSearch] = useState("")
  return (
    <div style={{
        margin:"2% auto"
      }}>
      <div>
        <input placeholder="Buscar producto aca" name="search" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="container-table-format">
        <TableFormat search={search} />
      </div>
    </div>
  );
};
