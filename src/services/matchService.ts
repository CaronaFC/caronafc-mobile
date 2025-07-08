import axios from "axios";
import { api } from "../lib/api";
import { footballApi } from "../lib/football-api";


export async function fetchAllMatches(): Promise<any> {
    try {
        const response = await api.get('/jogo/listar');
        return response.data;
    } catch (error) {
        throw new Error("Erro inesperado ao buscar jogos.");
    }
}


export async function fetchMatchById(id: string): Promise<any> {
    try {
        const response = await footballApi.get(`/match/?match_id=${id}`);
        console.log("Dados do jogo:", response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
            throw new Error("Jogo não encontrado.");
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erro ao buscar jogo:", error.response?.data || error.message);
        } else {
            console.error("Erro inesperado:", error);
        }

        throw new Error("Erro inesperado ao buscar jogo.");
    }
}