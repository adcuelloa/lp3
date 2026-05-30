import { create } from "axios";

const http = create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // envía cookies HTTP-only en requests cross-origin
});

export default http;
