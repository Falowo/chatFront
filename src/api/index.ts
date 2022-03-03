import axios from "axios";

export const url = process.env.REACT_APP_API_URL;



export const instance = axios.create({
  baseURL: url,
  timeout: 1000,
  headers: {
    "x-auth-token": localStorage.getItem("token") || "",
  },
});

export const authInstance = axios.create({
  baseURL: url,
  timeout: 1000,
});

export const setHeaders = () => {
  const header = {
    headers: {
      "x-auth-token": localStorage.getItem("token") || "",
    },
  };
  return header;
};
// Add a request interceptor
instance.interceptors.request.use(async (config)=> {
  const token = await getToken(); 
    if (token) config.headers!["x-auth-token"] = `${token}`;
  return config;
},  (error)=> {
  // Do something with request error
  return Promise.reject(error);
});

function getToken() {
  return localStorage.getItem("token") || ""
}

