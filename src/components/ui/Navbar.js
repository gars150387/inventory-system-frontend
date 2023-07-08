import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { onAddNewAdminUser } from "../../store/slices/adminSlice";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import { onResetCart } from "../../store/slices/orderSlice";

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
        uid: ""
      })
    );
    dispatch(onResetCart());
    navigate("/");
  };
  return (
    <Grid
      container
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      style={{ border: "1px solid v#155EEF", height: "4rem" }}
    >
      <Grid
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-around"}
        item
        xs={10}
      >
        <Grid
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          marginLeft={"2rem"}
          item
          xs={2}
        >
          <a href="./" className="navbar-brand">
            Rosa Mistica
          </a>
        </Grid>
        <Grid
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={5}
          item
          xs={8}
        >
          {adminUser.token === "" && (
            <NavLink to="./">
              <a href="./" className="nav-link active" aria-current="page">
                Inicio
              </a>
            </NavLink>
          )}

          {adminUser.token && (
            <>
              <NavLink to="./ventas">
                <a href="./ventas" className="nav-link">
                  Venta
                </a>
              </NavLink>
            </>
          )}

          {adminUser.role === "Administrador" && (
            <>
              <NavLink to="./register">
                <a href="./register" className="nav-link">
                  Nuevo Usuario
                </a>
              </NavLink>
              <NavLink to="./all-orders">
                <a href="./all-orders" className="nav-link">
                  Ventas Totales
                </a>
              </NavLink>
            </>
          )}
          {adminUser.role === "Administrador" ||
          adminUser.role === "Encargado" ? (
            <NavLink to="./feed_stock">
              <a href="./feed_stock" className="nav-link">
                Ingresar Inventario
              </a>
            </NavLink>
          ) : null}
          {adminUser.token && (
            <>
              <a href="./" onClick={handleSignOut} className="nav-link">
                <strong>{adminUser.name}</strong>
              </a>
            </>
          )}
        </Grid>
        <Grid
          display={"flex"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          item
          xs={2}
        >
          {" "}
          <NavLink to="./">
            <a href="./" onClick={handleSignOut} className="nav-link">
              Cerrar sesion
            </a>
          </NavLink>
        </Grid>
      </Grid>
    </Grid>
  );
};
