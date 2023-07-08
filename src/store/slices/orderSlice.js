import { createSlice } from "@reduxjs/toolkit";

const order = [];

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order
  },
  reducers: {
    onAddToOrder: (state, { payload }) => {
      let index = 0;
      state.order.splice(index, 0, payload);
      index++
    },
    onResetCart:(state)=>{
      state.order = []
    },
    onDeleteItemInCart:(state, {payload}) => {
      state.order = payload
    },
    onEditItemInOrder:(state, {payload}) => {
      state.order = payload
    }
  }
});

export default orderSlice.reducer;

// Action creators are generated for each case reducer function
export const { onAddToOrder, onResetCart, onDeleteItemInCart, onEditItemInOrder } = orderSlice.actions;
