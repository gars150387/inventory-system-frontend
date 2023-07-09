import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Grid, OutlinedInput, Typography } from "@mui/material";
import { apiBase } from "../components/api/Api";
import ItemsInTable from "../components/sale/ItemsInTable";
import NewOrder from "../components/sale/NewOrder";
import { useDispatch, useSelector } from "react-redux";
import { onResetCart } from "../store/slices/orderSlice";
import { Popconfirm, notification } from "antd";
import { useForm } from "react-hook-form";

const PaginaPrincipalVentas = () => {
  const { order } = useSelector((state) => state.order);
  const { adminUser } = useSelector((state) => state.admin);
  const [newOrder, setNewOrder] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch
  } = useForm();
  const adminUserList = useQuery({
    querykey: ["listOfAdminUser"],
    queryFn: () => apiBase.get("/admin/admin-user")
  });

  const totalAPagar = () => {
    let firstResult = [];
    let index = 0;
    let noDeleteItem = 0;
    for (let data of order) {
      let check = data.quantity * data.price;
      firstResult.splice(index, noDeleteItem, check);
      index++;
    }
    const initialValue = 0;
    const sumWithInitial = firstResult.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );
    return sumWithInitial;
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api.open({
      message: "Orden emitida"
    });
  };

  const handleCancelOrder = () => {
    dispatch(onResetCart());
    setNewOrder(false);
  };

  const handleSubmitOrder = async () => {
    let index = 0
    let newOrderToSubmit = {
      clientName: watch("client"),
      salePerson: `${adminUser.email}`,
      order: order,
      total: totalAPagar()
    };

    const resp = await apiBase.post("/item/new-order", newOrderToSubmit);
    if (resp) {
      await dispatch(onResetCart());
      setValue("client", "");
      setNewOrder(false);
      index === 0 && openNotificationWithIcon();
      index++
    }
  };

  if (adminUserList.isLoading) return <p>Cargando usuarios...</p>;
  if (adminUserList.data) {
    return (
      <>
        {contextHolder}
        <Grid
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          marginY={3}
          container
        >
          <Grid
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            item
            xs={10}
          >
            <Grid
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              textAlign={"left"}
              style={{
                paddingLeft: "0px"
              }}
              item
              xs={2}
            >
              <Typography
                textTransform={"none"}
                style={{
                  color: "#000",
                  lineHeight: "38px"
                }}
                textAlign={"left"}
                fontWeight={600}
                fontFamily={"Inter"}
                fontSize={"30px"}
              >
                Ventas
              </Typography>
            </Grid>
            <Grid
              display={"flex"}
              alignItems={"center"}
              justifyContent={"flex-end"}
              textAlign={"left"}
              item
              xs={2}
            >
              <Button
                style={{
                  width: "fit-content",
                  border: "1px solid var(--blue-dark-600, #155EEF)",
                  borderRadius: "8px",
                  background: "var(--blue-dark-600, #155EEF)",
                  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                }}
                onClick={() => setNewOrder(true)}
              >
                <Icon
                  icon="ic:baseline-plus"
                  color="#FFF"
                  width={20}
                  height={20}
                />
                &nbsp;
                <Typography
                  textTransform={"none"}
                  style={{
                    color: "#FFF",
                    fontSize: "14px",
                    fontWeight: "600",
                    fontFamily: "Inter",
                    lineHeight: "20px"
                  }}
                >
                  Crea nueva orden
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          marginY={3}
          container
        >
          <Grid
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            marginX={5}
            item
            xs={10}
          >
            <ItemsInTable />
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit(handleSubmitOrder)}>
          {newOrder && (
            <Grid
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              marginY={3}
              container
            >
              <Grid
                display={"flex"}
                justifyContent={"space-around"}
                alignItems={"center"}
                marginY={2}
                item
                xs={10}
              >
                <Grid
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                  marginRight={2}
                  item
                  xs={6}
                >
                  <OutlinedInput
                    fullWidth
                    placeholder="Nombre del cliente"
                    {...register("client", { required: true })}
                  />
                </Grid>
                <Grid
                  justifyContent={"flex-start"}
                  alignItems={"center"}
                  marginRight={2}
                  item
                  xs={4}
                >
                  <OutlinedInput
                    fullWidth
                    value={`Vendedora: ${adminUser.name}`}
                    disabled
                  />
                  {errors?.name && <p>Nombre del cliente es requerido</p>}
                </Grid>
                <Grid
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"right"}
                  gap={2}
                  marginY={2}
                  textAlign={"left"}
                  item
                  xs={6}
                >
                  <Popconfirm
                    title="Seguro desea cancelar la orden?"
                    onConfirm={() => handleCancelOrder()}
                  >
                    <Button
                      style={{
                        width: "fit-content",
                        border: "1px solid var(--blue-dark-600, #155EEF)",
                        borderRadius: "8px",
                        background: "red",
                        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                      }}
                    >
                      <Typography
                        textTransform={"none"}
                        style={{
                          color: "#FFF",
                          fontSize: "14px",
                          fontWeight: "600",
                          fontFamily: "Inter",
                          lineHeight: "20px"
                        }}
                      >
                        Cancelar orden
                      </Typography>
                    </Button>
                  </Popconfirm>
                  {/* <Popconfirm
                    title="Esta lista para procesar?"
                    onConfirm={() => handleSubmitOrder()}
                  > */}
                  <Button
                    style={{
                      width: "fit-content",
                      border: "1px solid var(--blue-dark-600, #155EEF)",
                      borderRadius: "8px",
                      background: "var(--blue-dark-600, #155EEF)",
                      boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                    }}
                    type="submit"
                  >
                    <Typography
                      textTransform={"none"}
                      style={{
                        color: "#FFF",
                        fontSize: "14px",
                        fontWeight: "600",
                        fontFamily: "Inter",
                        lineHeight: "20px"
                      }}
                    >
                      Emitir orden
                    </Typography>
                  </Button>
                  {/* </Popconfirm> */}
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    textTransform={"none"}
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "Inter",
                      lineHeight: "20px"
                    }}
                  >
                    Total a pagar: ${totalAPagar()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {newOrder && (
            <Grid
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              marginY={3}
              container
            >
              <Grid
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                item
                xs={10}
              >
                <NewOrder />
              </Grid>
            </Grid>
          )}
        </form>
      </>
    );
  }
};

export default PaginaPrincipalVentas;
