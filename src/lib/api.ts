import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:3000";

export const api = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
})