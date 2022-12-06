import Swal from "sweetalert2";
import { apiBase } from "../components/api/Api";
import { useForm } from "../hooks/useForm";
import "../style/component/Login.css";
import { useNavigate } from "react-router";
import { UpdateUser } from "./UpdateUser";

const registerFormFields = {
  registerName: "",
  registerEmail: "",
  registerPassword: "",
  registerPassword2: "",
  registerRole: "",
};

export const Register = () => {
  const navigate = useNavigate();
  const {
    registerName,
    registerEmail,
    registerPassword,
    registerPassword2,
    registerRole,
    onInputChange: onRegisterInputChange,
  } = useForm(registerFormFields);

  const onSubmitRegister = async (event) => {
    event.preventDefault();
    try {
      if (registerPassword !== registerPassword2) {
        Swal.fire("error", "Passwords must match", "error");
        return;
      } else {
        const response = await apiBase.post("/admin/new_admin_user", {
          name: registerName,
          email: registerEmail.toLowerCase(),
          password: registerPassword,
          role: registerRole,
        });
        if (response) {
          navigate("/pricing");
        }
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
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div className="login-container">
            <div className="login-form-2">
              <h3>Register</h3>
              <form onSubmit={onSubmitRegister}>
                <div className="form-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="registerName"
                    value={registerName}
                    onChange={onRegisterInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="registerEmail"
                    value={registerEmail}
                    onChange={onRegisterInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="registerPassword"
                    value={registerPassword}
                    onChange={onRegisterInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repite password"
                    name="registerPassword2"
                    value={registerPassword2}
                    onChange={onRegisterInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <select
                    type="text"
                    className="form-control"
                    placeholder="Permiso"
                    name="registerRole"
                    // value={registerRole}
                    onChange={onRegisterInputChange}
                  >
                    <option defaultValue>Selecciona el role</option>
                    <option value="Vendedor">Vendedor</option>
                    <option value="Encargado">Encargado</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <input
                    type="submit"
                    className="btnSubmit"
                    value="Register user"
                  />
                </div>
              </form>
            </div>
        </div>
        <UpdateUser />
      </div>
    </>
  );
};
