import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { apiBase } from "../components/api/Api";
import "../style/component/UpdateAdminUserRole.css";

export const UpdateUser = () => {
  const [role, setRole] = useState("");
  const [adminUser, setAdminUser] = useState([]);
  const [statusEdit, setStatusEdit] = useState(false);
  const [reload, setReload] = useState(false)
  useEffect(() => {
    const controller = new AbortController();
    const callApiAdminUser = async () => {
      const response = await apiBase.get("/admin/admin-user");
      if (response) {
        setAdminUser(response.data.adminUsers);
      }
    };
    callApiAdminUser();
    return () => {
      controller.abort();
    };
  }, [reload]);

  const onUpdateUserRole = async (user) => {
    try {
      const response = await apiBase.put(`/admin/update-role/${user._id}`, {
        role: role,
      });
      if (response) {
        alert("Permiso de usuario actualizado");
        setStatusEdit(false)
        setReload(!reload)
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
      <div style={{ height: "50vh", overflow: "auto" }}>
        {adminUser?.map((user) => {
          return (
            <div
              style={{
                width: "100%",
                margin: "2% auto",
                border: "1px dashed #212529",
                padding: "15px",
                borderRadius: "15px",
              }}
            >
              {statusEdit === false ? (
                <button onClick={() => setStatusEdit(!statusEdit)}>
                  Editar
                </button>
              ) : (
                <>
                  <button onClick={() => onUpdateUserRole(user)}>
                    Guardar
                  </button>
                  <button onClick={() => setStatusEdit(!statusEdit)}>
                    Cancelar
                  </button>
                </>
              )}

              <div>
                {" "}
                <label>Nombre:&nbsp;</label>
                <strong>{user.name}</strong>
              </div>
              <div>
                <label>Email:&nbsp;</label>
                <strong>{user.email}</strong>
              </div>
              <div>
                <label>Role:&nbsp;</label>
                {statusEdit === false ? (
                  <strong>{user.role}</strong>
                ) : (
                  <select
                    name="role"
                    onChange={(event) => setRole(event.target.value)}
                  >
                    <option defaultValue={user.role}>{user.role}</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Encargado">Encargado</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                )}
              </div>
              <div>
                {" "}
                <label>Status:&nbsp;</label>
                <strong>{user.active === true ? "Activo" : "No-Activo"}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
