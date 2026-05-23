import { create } from "axios";

const http = create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default http;
