import { Game } from "./game";
import { PassengerType } from "./passanger";
import { DriverType } from "./user";
import { VeiculoType } from "./vehicle";

export type CreateTravelType = {
  motoristaId: number;
  jogo: Game;
  origem_lat: number;
  origem_long: number;
  destino_lat: number;
  destino_long: number;
  horario: string;
  qtdVagas: number;
  temRetorno: boolean;
  valorPorPessoa: number;
  veiculoId: number;
  status?: string;
};

export type CardTravelProps = {
  id: number;
  horario: string;
  valorPorPessoa: string;
  origemLat: number;
  origemLong: number;
  temRetorno: boolean;
  qtdVagas: number;
  motorista: DriverType;
  jogo: Game;
  veiculo: VeiculoType;
  handleRequest: (id: number) => void;
};

export type TravelAPIResponseType = {
  id: number;
  horario: string;
  valorPorPessoa: string;
  origem_lat: number;
  origem_long: number;
  temRetorno: boolean;
  qtdVagas: number;
  veiculo: VeiculoType;
  motorista: { id: number; nome_completo: string };
  jogo: Game;
  passageiros?: PassengerType[];
  status: string;
  criadoEm: string;
};
