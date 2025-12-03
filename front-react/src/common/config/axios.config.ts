// src/common/config/axios.config.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// 1. Intercepteur de REQUÊTE : Injecte le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Intercepteur de RÉPONSE : Gère l'expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est invalide ou expiré (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // On nettoie le local storage
      localStorage.removeItem("accessToken");
      // On redirige vers le login (ou on lance un event que AuthContext écoute)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
