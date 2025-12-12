import axios from "axios";

const api = axios.create({
  baseURL: "https://scrap-backend-px9j.onrender.com/api/", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
