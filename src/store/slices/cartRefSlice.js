import { createSlice } from "@reduxjs/toolkit";

const cartRefSlice = createSlice({
  name: "cartRef",
  initialState: {
    cartRef: [],
  },
  reducers: {
    onAddTocartRef: (state, { payload }) => {
      let index = 0;
      state.cartRef.splice(index, 0, payload);
      index++
    },
    onResetCartRef:(state)=>{
      state.cartRef = []
    },
    onDeleteItemInCartRef:(state, {payload}) => {
      state.cartRef = payload
    },
    onEditItemIncartRef:(state, {payload}) => {
      state.cartRef = payload
    }
  }
});

export default cartRefSlice.reducer;

// Action creators are generated for each case reducer function
export const { onAddTocartRef, onResetCartRef, onDeleteItemInCartRef, onEditItemIncartRef, onAddRef } = cartRefSlice.actions;
