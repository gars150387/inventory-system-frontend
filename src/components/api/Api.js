import axios from "axios";
//https://rosa-mistica-backend-c56l-dev.fl0.io
//https://rosa-mistica-app-backend.herokuapp.com
export const apiBase = axios.create({
  baseURL: "https://rosa-mistica-backend-c56l-dev.fl0.io/api",
});

//TODO: config interceptors
apiBase.interceptors.request.use((config) => {
  if (localStorage.getItem("token")) {
    config.headers = {
      "x-token": localStorage.getItem("token"),
    };
  }
  return config
});