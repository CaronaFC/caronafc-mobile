import { api } from "../lib/api";
import { TeamType } from "../types/teams";

export async function fetchAllTeams(): Promise<TeamType[]> {
  try {
    const response = await api.get("/teams/listar");
    return response.data;
  } catch (error) {
    throw new Error("Erro inesperado ao buscar jogos.");
  }
}
