export type Game = {
  id: number;
  data: string;
  horario: string;
  pais: string | null;
  liga: {
    id: number | null;
    nome: string;
  }
  fase: {
    id: number | null;
    nome: string;
    is_active: boolean;
  };
  timeCasa: {
    id: number;
    nome: string;
  },
  timeFora: {
    id: number;
    nome: string;
  };
  estadio: {
    id: number;
    nome: string;
    cidade: string;
  };
};