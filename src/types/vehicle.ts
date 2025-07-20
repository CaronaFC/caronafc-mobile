export type CreateVehicleType = {
  placa: string;
  renavam: string;
  marca: string;
  modelo: string;
  cor: string;
  tipoVeiculoId: number;
  usuarioId: number;
};

export type TipoVeiculoType = {
  id: number;
  descricao: string;
};

export type VeiculoType = {
  id: number;
  placa: string;
  renavam: string;
  marca: string;
  modelo: string;
  cor: string;
  tipoVeiculo: TipoVeiculoType;
};
