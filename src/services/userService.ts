import axios from "axios";
import { api } from "../lib/api";

export async function getUserById(userId: Number, token: string): Promise<any> {
    try {
        const response = await api.get(`/usuario/${userId}`)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            if (status == 401) {
                console.log("Credenciais inválidas")
                throw new Error(`Credenciais inválidas`);
            }
            const message = error.response?.data?.message || "Erro na requisição"
            throw new Error(`Erro ${status ?? "desconhecido"}: ${message}`);
        } else {
            throw new Error("Erro inesperado ao registrar usuário.");
        }
    }
}

export async function getVehiclesTypes(): Promise<any> {
    try {
        const response = await api.get('/tipoveiculo');
        return response.data;
    } catch (error) {
        throw new Error("Erro inesperado ao buscar tipos de veículos.");
    }
}