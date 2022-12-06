import { apiBase } from "../components/api/Api";
import { useForm } from "../hooks/useForm";
import "../style/component/Login.css";
import { useDispatch } from "react-redux";
import { onAddNewAdminUser } from "../store/slices/adminSlice";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const loginFormFields = {
  loginEmail: "",
  loginPassword: "",
};

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loginEmail,
    loginPassword,
    onInputChange: onloginInputChange,
  } = useForm(loginFormFields);

  const onSubmitLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await apiBase.post("/admin/login", {
        email: loginEmail.toLowerCase(),
        password: loginPassword,
      });

      if (response) {
        console.log("response", response);
        navigate("/sale");
      }
      dispatch(
        onAddNewAdminUser({
          name: response.data.name,
          email: response.data.email,
          token: response.data.token,
          iud: response.data.uid,
          role: response.data.role,
        })
      );
    } catch (error) {
      console.log(
        "🚀 ~ file: Login.js ~ line 29 ~ onSubmitLogin ~ error",
        error
      );
      Swal.fire("Error", "Usuario/Contrasena no coinciden", "error")
    }
  };

  return (
    <div className="container login-container">
        <div className="login-form-1">
          <h3>Sign In</h3>
          <form onSubmit={onSubmitLogin}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                name="loginEmail"
                value={loginEmail}
                onChange={onloginInputChange}
              />
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="loginPassword"
                value={loginPassword}
                onChange={onloginInputChange}
              />
            </div>
            <div className="d-grid gap-2">
              <input type="submit" className="btnSubmit" value="Login" />
            </div>
          </form>
        </div>
    </div>
  );
};
