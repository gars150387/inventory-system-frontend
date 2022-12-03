import { useState } from "react";
import { apiBase } from "../components/api/Api";
import Swal from "sweetalert2";

export const useOrder = () => {
  const [orderProcessed, setOrderProcessed] = useState(null);
  const [currentOrderProcessed, setCurrentOrderProcessed] = useState([]);

  const newOrderCall = async ({ cliente, addItem, totalToDisplay, salePerson }) => {
    try {
      const { data } = await apiBase.post("/item/new-order", {
        clientName: cliente,
        salePerson: `${salePerson}`,
        order: addItem,
        total: totalToDisplay,
      });
      if (data) {
        console.log("🚀 ~ file: useOrder.js:19 ~ newOrderCall ~ data", data);
        setOrderProcessed(data);
        setCurrentOrderProcessed(data)
        Swal.fire("", "Orden creada!", "success");
      }
    } catch (error) {
      console.log("🚀 ~ file: useOrder.js:24 ~ newOrderCall ~ error", error);
      alert(error);
    }
  };
  return {
    //*property
    orderProcessed,
    currentOrderProcessed,

    //*method
    newOrderCall,
  };
};
