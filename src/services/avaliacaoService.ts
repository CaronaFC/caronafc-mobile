import { api } from "../lib/api";

export interface CreateAvaliacaoDTO {
  nota: number;
  comentario?: string;
  avaliadoId: number;
  viagemId: number;
}

export const createAvaliacao = async (data: CreateAvaliacaoDTO) => {
  try {
    const response = await api.post('/avaliacao', data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    throw error;
  }
};