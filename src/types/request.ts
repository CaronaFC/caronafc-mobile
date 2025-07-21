import { TravelAPIResponseType } from "../types/travel"
import { UserType } from "../types/user"

export interface Request {
  id: number;
  status: string;
  usuario: UserType;
  viagem: TravelAPIResponseType;
  dataSolicitacao: string;
}
