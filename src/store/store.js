import { combineReducers, configureStore } from "@reduxjs/toolkit";
import adminUserSlice from "./slices/adminSlice";
import storage from "redux-persist/es/storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import orderSlice from "./slices/orderSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage
};

const reducers = combineReducers({
  admin: adminUserSlice,
  order: orderSlice
});

const persistedReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});
