import { api } from "../lib/api";
import { CreateTravelType, TravelAPIResponseType } from "../types/travel";

export async function createTravel(travelData: CreateTravelType): Promise<any> {
  try {
    const response = await api.post("/viagem", travelData);
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao criar viagem.");
  }
}

export async function getTravels(filters?: {
  motoristaId?: number;
  status?: string;
}): Promise<TravelAPIResponseType[]> {
  try {
    const params = filters ? filters : {};
    const response = await api.get("/viagem", { params });
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao buscar viagens.");
  }
}

export async function getTravelById(
  id: number
): Promise<TravelAPIResponseType> {
  try {
    const response = await api.get(`/viagem/${id}`);
    const travelData = response.data?.data || response.data;
    return travelData;
  } catch (error) {
    throw new Error("Erro inesperado ao buscar a viagem.");
  }
}

export async function updateTravelStatus(
  id: number,
  status: string
): Promise<TravelAPIResponseType> {
  try {
    const response = await api.patch(`/viagem/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao atualizar status da viagem.");
  }
}

export async function deleteTravel(id: number): Promise<void> {
  try {
    await api.delete(`/viagem/${id}`);
  } catch (error) {
    throw new Error("Erro inesperado ao deletar a viagem.");
  }
}

export async function fetchTravelHistory(usuarioId:number): Promise<TravelAPIResponseType[]> {
  const { data } = await api.get(`/viagem/usuario/${usuarioId}`, { params: { status: 'finalizada' } });
  return data;
}
