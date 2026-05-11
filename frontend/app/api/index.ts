import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
})

apiClient.interceptors.response.use((response)=>response.data)

export default apiClient