import { apiBase } from "../components/api/Api";
import { useDispatch } from "react-redux";
import { onAddNewAdminUser } from "../store/slices/adminSlice";
import { useNavigate } from "react-router";
import { Typography, FormLabel, Grid, OutlinedInput } from "@mui/material";
import { useForm } from "react-hook-form";
import { notification } from "antd";
import "./Login.css"
export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message) => {
    api.error({
      message: `Mensaje de error`,
      description: `${message.response.data.msg}`,
      placement: "topRight",
      duration: 0
    });
  };
  const onSubmitLogin = async (data) => {
    try {
      const response = await apiBase.post("/admin/login", {
        email: data.email,
        password: data.password
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
          role: response.data.role
        })
      );
    } catch (error) {
      openNotification(error);
    }
  };

  return (
    <>
      {contextHolder}

      <Grid
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        item
        xs={6}
      >
        <Grid
          container
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <Grid
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-around"}
            alignItems={"center"}
            className="login-container"
            container
          >
            <Typography
              style={{
                color: "var(--gray900, #101828)",
                fontSize: "30px",
                fontFamily: "Inter",
                fontWeight: "600",
                lineHeight: "38px"
              }}
              variant="h1"
            >
              Bienvenido
            </Typography>{" "}
            <Typography
              style={{
                color: "var(--gray-500, #667085)",
                fontSize: "16px",
                fontFamily: "Inter",
                lineHeight: "24px"
              }}
            >
              Por favor ingrese su correo electronico
            </Typography>
            <form
              style={{ padding: "30px" }}
              onSubmit={handleSubmit(onSubmitLogin)}
            >
              <Grid marginX={0} marginY={5} textAlign={"left"} item xs={12}>
                <FormLabel style={{ marginBottom: "0.5rem" }}>Email</FormLabel>
                <OutlinedInput
                  {...register("email", { required: true, minLength: 10 })}
                  aria-invalid={errors?.email ? true : false}
                  style={{
                    borderRadius: "12px",
                    border: `${errors?.email && "solid 1px #004EEB"}`
                  }}
                  placeholder="Enter your email"
                  fullWidth
                />
                {errors?.email && (
                  <Typography>El correo es requerido</Typography>
                )}
              </Grid>
              <Grid marginX={0} textAlign={"left"} item xs={12}>
                <FormLabel style={{ marginBottom: "0.5rem" }}>
                  Password
                </FormLabel>
                <OutlinedInput
                  {...register("password", { required: true, minLength: 6 })}
                  style={{ borderRadius: "12px" }}
                  placeholder="******"
                  type="password"
                  fullWidth
                />
                {errors?.password?.message}
              </Grid>
              <Grid
                marginY={"20px"}
                marginX={0}
                textAlign={"left"}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                item
                xs={12}
              >
                <Grid
                  item
                  xs={6}
                  display={"flex"}
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                >
                  <Typography
                    style={{
                      color: "#004EEB",
                      fontSize: "14px",
                      fontFamily: "Inter",
                      fontWeight: "600",
                      lineHeight: "20px",
                      cursor: "pointer"
                    }}
                  >
                    Olvido contrasena?
                  </Typography>
                </Grid>
              </Grid>
              <OutlinedInput
                style={{
                  color: "#fff",
                  width: "100%",
                  border: "1px solid var(--blue-dark-600, #155EEF)",
                  background: " var(--blue-dark-600, #155EEF)",
                  borderRadius: "8px",
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                }}
                type="submit"
                value="Sign in"
              />
            </form>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
