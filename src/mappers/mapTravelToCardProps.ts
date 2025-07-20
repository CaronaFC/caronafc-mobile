// src/mappers/mapTravelToCardProps.ts

import { CardTravelProps, TravelAPIResponseType } from "../types/travel";

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
    jogo: {
      id: item.jogo.id,
      estadio: item.jogo.nomeEstadio,
      timeCasa: item.jogo.timeCasa,
      timeFora: item.jogo.timeFora,
      dataJogo: item.jogo.dataJogo,
    },
  };
}
