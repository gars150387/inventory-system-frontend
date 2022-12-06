import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { onAddNewAdminUser } from "../../store/slices/adminSlice";
import { useDispatch } from "react-redux";

export const Navbar = () => {
  const { adminUser } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async (event) => {
    event.preventDefault();
    dispatch(
      onAddNewAdminUser({
        name: "",
        email: "",
        token: "",
        uid: "",
      })
    );
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <NavLink to="./">
          <a href="./" className="navbar-brand">
            Rosa Mistica
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </NavLink>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {adminUser.token === "" && (
              <NavLink to="./">
                <li className="nav-item">
                  <a href="./" className="nav-link active" aria-current="page">
                    Inicio
                  </a>
                </li>
              </NavLink>
            )}

            {adminUser.token && (
              <>
                <NavLink to="./sale">
                  <li className="nav-item">
                    <a href="./sale" className="nav-link">Venta</a>
                  </li>
                </NavLink>
                {/* <NavLink to="./pricing">
                  <li className="nav-item">
                    <a href="./pricing" className="nav-link">Precios</a>
                  </li>
                </NavLink> */}
              </>
            )}

            {adminUser.role === "Administrador" && (
              <>
                <NavLink to="./register">
                  <li className="nav-item">
                    <a href="./register" className="nav-link">Nuevo Usuario</a>
                  </li>
                </NavLink>
                <NavLink to="./feed_stock">
                  <li className="nav-item">
                    <a href="./feed_stock" className="nav-link">Ingresar Inventario</a>
                  </li>
                </NavLink>
              </>
            )}
            {adminUser.token && (
              <>
                <li className="nav-item">
                  <a href="" onClick={handleSignOut} className="nav-link">
                    <strong>{adminUser.name}</strong>
                  </a>
                </li>
                <NavLink to="./">
                  <li className="nav-item">
                    <a href="./" onClick={handleSignOut} className="nav-link">
                      Cerrar sesion
                    </a>
                  </li>
                </NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
