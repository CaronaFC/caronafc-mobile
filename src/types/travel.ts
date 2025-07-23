import { Game } from "./game";
import { PassengerType } from "./passanger";
import { DriverType, DriverTypePayment } from "./user";
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
  destino_lat: number; 
  destino_long: number;
  temRetorno: boolean;
  qtdVagas: number;
  veiculo: VeiculoType;
  motorista: DriverTypePayment;
  jogo: Game;
  passageiros?: PassengerType[];
  status: string;
  criadoEm: string;
};

export type TravelDatails = {
  id: number;
  destino: string;
  estadio: string;
  horario: string;
  valor: string; 
  data_viagem: string;
}

export type TravelPayment = {
  jogo: Game;
  motorista: DriverTypePayment;
  passageiros: PassengerType[];
  valorPorPessoa: string;
}
