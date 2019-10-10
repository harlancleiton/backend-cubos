import { RegraTipo } from '../models/regra-tipo.enum';

export interface Regra {
  id?: string;
  tipo: RegraTipo;
  dia?: string;
  diasSemana?: number[];
  inicio: string;
  fim: string;
}
