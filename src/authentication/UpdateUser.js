import React, { useState } from "react";
import Swal from "sweetalert2";
import { apiBase } from "../components/api/Api";
import "../style/component/UpdateAdminUserRole.css";

export const UpdateUser = () => {
  const [userEmail, setUserEmail] = useState("");
  console.log("🚀 ~ file: UpdateUser.js:8 ~ UpdateUser ~ userEmail", userEmail)
  const [role, setRole] = useState("");
  console.log("🚀 ~ file: UpdateUser.js:10 ~ UpdateUser ~ role", role)

  const onUpdateUserRole = async () => {
    try {
        const response = await apiBase.put("/admin/update-role", {
            email: userEmail,
            role: role
        })
        console.log("🚀 ~ file: UpdateUser.js:19 ~ onUpdateUserRole ~ response", response)
        if (response){
            Swal.fire("Actiaizado!", "Permiso actualizado", "success")
        }
    } catch (error) {
      console.log(
        "🚀 ~ file: Register.js ~ line 34 ~ onSubmitRegister ~ error",
        error
      );
      Swal.fire("error", `${error.response.data.msg}`, "error");
    }
  };

  return (
    <div className="updateAdminRole-container">
        <h3> Actualiza Admin Usuario Permiso</h3>
        <form className="updateAdminRole-form">
          <form>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="userEmail"
                value={userEmail}
                onChange={event => setUserEmail(event.target.value)}
              />
            </div>

            <div className="form-group mb-2">
              <select
                type="text"
                className="form-control"
                placeholder="Permiso"
                name="role"
                value={role}
                onChange={event => setRole(event.target.value)}
              >
                <option defaultValue>Selecciona el role</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Encargado">Encargado</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="d-grid gap-2">
              <button onClick={onUpdateUserRole}>Actualizar</button>
            </div>
          </form>{" "}
        </form>
    </div>
  );
};
