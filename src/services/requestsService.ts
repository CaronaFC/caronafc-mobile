import { api } from "../lib/api";

export async function fetchSolicitationDrive(): Promise<any> {
  try {
    const response = await api.get("/solicitacoes/motorista");
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao buscar solicitações.");
  }
}

export async function fetchSolicitationPassenger(): Promise<any> {
  try {
    const response = await api.get("/solicitacoes/minhas");
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao buscar solicitações.");
  }
}

export async function updateSolicitationStatus(
  id: number,
  status: "aceita" | "recusada"
): Promise<void> {
  await api.patch(`/solicitacoes/${id}/status/${status}`);
}
