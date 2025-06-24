import axios from "axios";

const API_URL = "http://192.168.1.13:3000";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
})