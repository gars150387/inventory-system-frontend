import { createSlice } from "@reduxjs/toolkit";

const adminUser = {
  name: "",
  email: "",
  token: "",
  uid: "",
};


const adminUserSlice = createSlice({
  name: "adminUser",
  initialState: {
    adminUser,
  },
  reducers: {
    onCheckAdminUser: (state, { payload }) => {
      state.adminUser = payload;
    },
    onAddNewAdminUser: (state, { payload }) => {
      state.adminUser = payload;
    },
    onUpdateAdminUser: (state, { payload }) => {
      state.adminUser = payload;
    },
  },
});

export default adminUserSlice.reducer;

// Action creators are generated for each case reducer function
export const { onAddNewAdminUser, onUpdateAdminUser, onCheckAdminUser } =
  adminUserSlice.actions;
