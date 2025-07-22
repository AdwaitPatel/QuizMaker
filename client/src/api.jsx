import axios from "axios";

// instance of axios with base URL
const api = axios.create({
  baseURL: "https://quizmakerapi.onrender.com",
});

export default api;
