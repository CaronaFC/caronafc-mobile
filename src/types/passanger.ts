export type PassengerType = {
  id: number;
  googleuid: string | null;
  nome_completo: string;
  email: string;
  numero: string;
  cpf: string;
  senha: string;
  imagem: string | null;
  data_nascimento: string | null;
  data_criacao: string;
};

export type PassengerTypePayment ={
  email: string,
  first_name: string,
  last_name: string,
  identification: UserDataIdentification,
}


export type UserDataIdentification = {
  type: 'CPF',
  number: string;
}
export type AddressType = {
  zip_code: string;
  street_name: string;
  street_number: string;
  neighborhood: string;
  city: string;
  federal_unit: string;
}