interface Jogo {
  nomeEstadio?: string;
  dataJogo?: string;
}

interface Usuario {
  nome_completo?: string;
}

interface Viagem {
  jogo?: Jogo;
  valorPorPessoa?: string;
}

export interface Solicitacao {
  id: number;
  status: string;
  usuario?: Usuario;
  viagem?: Viagem;
  dataSolicitacao: string;
}
