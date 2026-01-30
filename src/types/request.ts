import { TravelAPIResponseType } from "../types/travel";
import { UserDataType } from "../types/user";

export type RequestStatus = "pendente" | "aceita" | "recusada";

export type Request = {
  id: number;
  status: RequestStatus;
  usuario: UserDataType;
  viagem: TravelAPIResponseType;
  dataSolicitacao: string;
};
