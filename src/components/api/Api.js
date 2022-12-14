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

// export const devitrackApiAdmin = axios.create({
//   baseURL: "http://localhost:34001/api/admin"
// })

// devitrackApiAdmin.interceptors.request.use((config) => {
//   if (localStorage.getItem("admin-token")) {
//     config.headers = {
//       "x-token": localStorage.getItem("admin-token"),
//     };
//   }
//   return config
// });

// export const devitrackApiStripe = axios.create({
//   baseURL: "http://localhost:34001/api/stripe"
// })

// //TODO: config interceptors
// devitrackApiStripe.interceptors.request.use((config) => {
//   if (localStorage.getItem("token")) {
//     config.headers = {
//       "x-token": localStorage.getItem("token"),
//     };
//   }
//   return config
// });

// export const devitrackApiArticle = axios.create({
//   baseURL: "http://localhost:34001/api/article"
// })

// //TODO: config interceptors
// devitrackApiArticle.interceptors.request.use((config) => {
//   if (localStorage.getItem("token")) {
//     config.headers = {
//       "x-token": localStorage.getItem("token"),
//     };
//   }
//   return config
// });