import { api } from "../lib/api";
import { CreateVehicleType } from "../types/vehicle";

export async function getVehiclesTypes(): Promise<any> {
    try {
        const response = await api.get('/tipoveiculo');
        return response.data;
    } catch (error) {
        throw new Error("Erro inesperado ao buscar tipos de veículos.");
    }
}

export async function createVehicle(vehicleData: CreateVehicleType): Promise<any> {
  try {
    const response = await api.post('/veiculo', vehicleData);
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao criar veículo.");
  }
}

export async function deleteVehicleId(vehicleId: number): Promise<any> {
  try {
    const response = await api.delete(`/veiculo/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao deletar veículo.");
  }
}