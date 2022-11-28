import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CustomerFormat } from "../components/sale/CustomerFormat";
import { SelectItem } from "../components/sale/SelectItem";

export const Sale = () => {
  const [search, setSearch] = useState("")
  const { adminUser } = useSelector( state => state.admin)
  
  return (
    <div>
      <h2>Venta</h2>
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        width:"75%",
        margin:" 0 auto"
      }}>
        <div>
           <CustomerFormat />
        </div>
       <div>
        <label>Vendedor #: </label> {adminUser.iud}
       </div>
      </div>
      <div>
        <input placeholder="Buscar producto aca" name="search" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div>
        <SelectItem search={search}/>
      </div>
    </div>
  );
};
