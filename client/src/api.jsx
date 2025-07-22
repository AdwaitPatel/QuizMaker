import axios from "axios";

// instance of axios with base URL
const api = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;
