import { api } from "../lib/api";
import { CreateTravelType, TravelAPIResponseType } from "../types/travel";

export async function createTravel(travelData: CreateTravelType): Promise<any> {
  try {
    const response = await api.post("/viagem", travelData);
    return response.data;
  } catch (error) {
    console.error(error);
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
    console.error(error);
    throw new Error("Erro inesperado ao buscar viagens.");
  }
}

export async function getTravelById(
  id: number
): Promise<TravelAPIResponseType> {
  try {
    const response = await api.get(`/viagem/${id}`);
    console.log("getTravelById response:", JSON.stringify(response.data, null, 2));
    // Handle both direct data and wrapped { data: ... } responses
    const travelData = response.data?.data || response.data;
    return travelData;
  } catch (error) {
    console.error("getTravelById error:", error);
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
    console.error(error);
    throw new Error("Erro inesperado ao atualizar status da viagem.");
  }
}

export async function fetchTravelHistory(usuarioId:number): Promise<TravelAPIResponseType[]> {
  const { data } = await api.get(`/viagem/usuario/${usuarioId}`, { params: { status: 'finalizada' } });
  return data;
}
