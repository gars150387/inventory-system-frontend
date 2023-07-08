import axios from "axios";

export const apiBase = axios.create({
  baseURL: "https://rosa-mistica-app-backend.herokuapp.com/api",
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