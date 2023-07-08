import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button, Grid, Typography } from "@mui/material";
import ItemInTableInStock from "../components/feedStock/ItemInTableInStock";

const PaginaPrincipalInventario = () => {
  const [newItem, setNewItem] = useState(false);
    return (
      <>
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
                onClick={() => setNewItem(!newItem)}
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

export default PaginaPrincipalInventario;
