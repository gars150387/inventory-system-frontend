import Swal from "sweetalert2";
import { useDispatch } from 'react-redux'
import { apiBase } from "../components/api/Api";
import { useForm } from "../hooks/useForm";
import "../style/component/Login.css";
import { onAddNewAdminUser } from "../store/slices/adminSlice";
import { useNavigate } from "react-router";

const registerFormFields = {
  registerName: "",
  registerEmail: "",
  registerPassword: "",
  registerPassword2: "",
};

export const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    registerName,
    registerEmail,
    registerPassword,
    registerPassword2,
    onInputCHange: onRegisterInputChange,
  } = useForm(registerFormFields);

  const onSubmitRegister = (event) => {
    event.preventDefault();

    if (registerPassword !== registerPassword2) {
      Swal.fire("error", "Passwords must match", "error");
      return;
    } else {
      apiBase.post("/admin/new_admin_user", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role:"Vendedor"
      });
      dispatch(onAddNewAdminUser({
        name:registerName,
        email:registerEmail,
      }))
      navigate("/pricing")
    }
  };

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-2">
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
    </div>
  );
};
