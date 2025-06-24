import axios from "axios";
import { api } from "../lib/api"
import { RegisterResponseType, RegisterUserType } from "../types/auth";


export async function registerUser(userData: RegisterUserType): Promise<RegisterResponseType> {
    try {
        const response = await api.post("/usuario", userData)
        console.log("response")
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            const message = error.response?.data?.message || "Erro na requisição"
            throw new Error(`Erro ${status ?? "desconhecido"}: ${message}`);
        } else {
            throw new Error("Erro inesperado ao registrar usuário.");
        }
    }
}