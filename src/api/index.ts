import axios from "axios";

export const url = process.env.REACT_APP_API_URL;

export const instance = () =>
  axios.create({
    baseURL: url,
    timeout: 30000,
    headers: {
      "x-auth-token": localStorage.getItem("token") || "",
    },
  });

export const authInstance = axios.create({
  baseURL: url,
  timeout: 30000,
});


