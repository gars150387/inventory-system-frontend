import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiBase } from "../components/api/Api";
import { SelectItem } from "../components/sale/SelectItem";
import "./sale.css";

export const Sale = () => {
  const [search, setSearch] = useState("");
  const { adminUser } = useSelector((state) => state.admin);
  const [listOfAdminUser, setListOfAdminUser] = useState([]);
  const [salePerson, setSalePerson] = useState("");
  console.log("🚀 ~ file: Sale.js:12 ~ Sale ~ salePerson", salePerson)
  console.log(
    "🚀 ~ file: Sale.js:11 ~ Sale ~ listOfAdminUser",
    listOfAdminUser
  );

  const callApiForAdminUser = async () => {
    const response = await apiBase.get("/admin/admin-user");
    if (response) {
      setListOfAdminUser(response.data.adminUsers);
    }
  };
  useEffect(() => {
    callApiForAdminUser();
  }, []);

  return (
    <div className="container-sale-page">
      <h2>Venta</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "75%",
          margin: " 0 auto",
        }}
      >
        <div>
          <label>
            <strong>Vendedor: </strong>
          </label>{" "}
          <select
            name="salePerson"
            onChange={(event) => setSalePerson(event.target.value)}
          >
            <option defaultValue></option>
            {listOfAdminUser?.map((user) => {
              return (
                <>
                  <option name="salePerson" value={`${user.name} | ${user._id}`}>
                    {user.name}
                  </option>
                </>
              );
            })}
            );
          </select>
        </div>
        <div>
          <label>
            <strong>Sesion activa: </strong>
          </label>{" "}
          {adminUser.iud}
        </div>
      </div>
      <div>
        <input
          placeholder="Buscar producto aca"
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <div className="container-selection-item">
        <SelectItem salePerson={salePerson} search={search} />
      </div>
    </div>
  );
};
