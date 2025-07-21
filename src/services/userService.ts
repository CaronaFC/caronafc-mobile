import axios from "axios";
import { api } from "../lib/api";

export async function getUserById(userId: Number): Promise<any> {
  try {
    const response = await api.get(`/usuario/${userId}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status == 401) {
        console.log("Credenciais inválidas");
        throw new Error(`Credenciais inválidas`);
      }
      const message = error.response?.data?.message || "Erro na requisição";
      throw new Error(`Erro ${status ?? "desconhecido"}: ${message}`);
    } else {
      throw new Error("Erro inesperado ao registrar usuário.");
    }
  }
}

export async function getUserVehicle(userId: number): Promise<any[]> {
  try {
    const response = await api.get(`/usuario/veiculos`);
    return response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        console.log("Credenciais inválidas");
        throw new Error("Credenciais inválidas");
      }
      const message = error.response?.data?.message || "Erro na requisição";
      throw new Error(`Erro ${status ?? "desconhecido"}: ${message}`);
    } else {
      throw new Error("Erro inesperado ao buscar veículos.");
    }
  }
}
