// src/mappers/mapTravelToCardProps.ts

import { CardTravelProps, TravelAPIResponseType } from "../types/travel";
import { Game } from '../types/game';

export function mapTravelToCardProps(
  item: TravelAPIResponseType
): CardTravelProps {
  return {
    id: item.id,
    horario: item.horario,
    valorPorPessoa: item.valorPorPessoa,
    origemLat: item.origem_lat,
    origemLong: item.origem_long,
    temRetorno: item.temRetorno,
    qtdVagas: item.qtdVagas,
    veiculo: item.veiculo,
    motorista: {
      nome: item.motorista.nome_completo,
      id: item.motorista.id,
    },
    jogo: item.jogo as Game,
  };
}

export function mapRawGameToGameProps(
  jogo: any
): Game {
  return {
    id: jogo.id,
    data: jogo.date,
    horario: jogo.time,
    pais: jogo.country?.name || "País Indefinido",
    liga: {
      id: jogo.league?.id || null,
      nome: jogo.league?.name || "Liga Indefinida",
    },
    fase: {
      id: jogo.stage?.id || null,
      nome: jogo.stage?.name || "Fase Indefinida",
      is_active: jogo.stage?.is_active || false,
    },
    estadio: {
      id: jogo.stadium?.id || null,
      nome: jogo.stadium?.name || "Estádio Indefinido",
      cidade: jogo.stadium?.city || "Cidade Indefinida",
    },
    timeCasa: {
      id: jogo.teams?.home?.id || null,
      nome: jogo.teams?.home?.name || "Indefinido",
    },
    timeFora: {
      id: jogo.teams?.away?.id || null,
      nome: jogo.teams?.away?.name || "Indefinido",
    },
  };
}
