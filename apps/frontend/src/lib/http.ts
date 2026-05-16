import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

export default http;
