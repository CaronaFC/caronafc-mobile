import axios from "axios";

const API_TOKEN = process.env.EXPO_PUBLIC_SOCCERAPI_KEY;
const API_URL = "https://api.soccerdataapi.com/";


export const footballApi = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
    params: {
        auth_token: API_TOKEN,
    }
});