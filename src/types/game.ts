export type GameType = {
  id: number;
  estadio: string;
  timeCasa: string;
  timeFora: string;
  campeonato?: string;
  dataJogo: string;
};

export type GameAPIType = {
  id: number;
  nomeEstadio: string;
  timeCasa: string;
  timeFora: string;
  dataJogo: string;
};
