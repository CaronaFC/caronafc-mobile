export type CreateTravelType = {
  motoristaId: number;
  jogo: object | string;
  origem_lat: number;
  origem_long: number;
  horario: string;
  qtdVagas: number;
  temRetorno: boolean;
  valorPorPessoa: number;
}