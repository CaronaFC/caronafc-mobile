import { api } from "../lib/api";

export async function openRequest(id: number): Promise<any> {
  try {
    const response = await api.post("/solicitacoes", { viagemId: id });
    
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Status inesperado: ${response.status}`);
    }
  } catch (error: any) {  
    if (error.response && error.response.status === 403) {
      throw new Error(error.response.data.message || "Você já solicitou essa viagem.");
    }
    throw new Error("Erro inesperado ao pedir uma solicitação.");
  }
}

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
