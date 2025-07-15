import { api } from "../lib/api";
import { CreateTravelType } from "../types/travel";

export async function createTravel(travelData: CreateTravelType): Promise<any> {
  try {
    const response = await api.post('/viagem', travelData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro inesperado ao criar viagem.");
  }
}

export async function getTravels(filters?: { motoristaId?: number }): Promise<any> {
  try {
    const params = filters ? filters : {};
    const response = await api.get('/viagem', { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro inesperado ao buscar viagens.");
  }
}
