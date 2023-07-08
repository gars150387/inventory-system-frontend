import React, { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { useMutation, useQuery} from "@tanstack/react-query";
import { Button, Grid, OutlinedInput, Typography } from "@mui/material";
import { apiBase } from "../components/api/Api";
import NewOrder from "../components/sale/NewOrder";
import { useDispatch, useSelector } from "react-redux";
import { onResetCart } from "../store/slices/orderSlice";
import { Popconfirm, notification } from "antd";
import { useForm } from "react-hook-form";
import ItemInTableInStock from "../components/feedStock/ItemInTableInStock";

const PaginaPrincipalInventario = () => {
    const { order } = useSelector((state) => state.order);
    const { adminUser } = useSelector((state) => state.admin);
    const [newItem, setNewItem] = useState(false);
    const dispatch = useDispatch();
    const {
      register,
      formState: { errors },
      setValue,
      handleSubmit,
      watch
    } = useForm();
    const CurrentListOfStockQuery = useQuery({
      querykey: ["listOfCurrentStok"],
      queryFn: () => apiBase.get("/item/inventory")
    });
  
    const newOrderSubmitQuery = useMutation({
      queryFn: (newOrderFormat) => apiBase.post("/item/new-order", newOrderFormat)
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
  
    const handleCancelOrder = () => {
      dispatch(onResetCart());
      setNewItem(false);
    };
    const handleSubmitOrder = async () => {
      let newOrderToSubmit = {
        clientName: watch("client"),
        salePerson: `${adminUser.email}`,
        order: order,
        total: totalAPagar()
      };
  
      await apiBase.post("/item/new-order", newOrderToSubmit)
      await dispatch(onResetCart());
      setValue("client", "");
      setNewItem(false);
    };
  
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
      api.open({
        message: "Orden emitida"
      });
    };
    const displayNotification = useCallback(() => {
      openNotificationWithIcon();
    }, []);
    if (newOrderSubmitQuery.status ==="success") return displayNotification();
    if (CurrentListOfStockQuery.isLoading) return <p>Cargando usuarios...</p>;
    if (CurrentListOfStockQuery.data) {
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
                  Inventario
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
                  onClick={() => setNewItem(true)}
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
                    Ingresar nuevo articulo
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
           <ItemInTableInStock newItem={newItem} setNewItem={setNewItem} />
            </Grid>
          </Grid>
        </>
      );
    }
  };

export default PaginaPrincipalInventario