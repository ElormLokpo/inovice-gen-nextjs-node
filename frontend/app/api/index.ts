import axios from "axios";
import { useAuthStore } from "../store";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000",
})

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

export default apiClient
