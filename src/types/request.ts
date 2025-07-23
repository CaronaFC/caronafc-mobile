import { TravelAPIResponseType, TravelDatails } from "../types/travel";
import { DriverTypePayment, UserDataPayment, UserDataType } from "../types/user";

export type RequestStatus = "pendente" | "aceita" | "recusada";

export type RequestType = {
  id: number;
  status: RequestStatus;
  usuario: UserDataType;
  viagem: TravelAPIResponseType;
  dataSolicitacao: string;
};

export type RequestDetails = {
  id: number;
  status: RequestStatus;
  usuario: UserDataType;
  motorista: DriverTypePayment;
  viagem: TravelDatails;
  dataSolicitacao: string;
  solicitacaoId: number;
}

export type RequestPayment = {
  id: number;
  origem_lat: number;
  origem_long: number;
  destino: string;
  estadio: string;
  data_viagem: string;
  horario_viagem: string;
  usuario: UserDataPayment;
  motorista: DriverTypePayment;
  valor: string;
}
