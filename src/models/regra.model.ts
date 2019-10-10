import * as moment from 'moment';
import * as uuid from 'uuid';
import db from '../database/jsondb';
import { RegraTipo } from './regra-tipo.enum';

export interface RegraFiltro {
  inicio: string;
  fim: string;
}

export interface Regra {
  id?: string;
  tipo: RegraTipo;
  dia?: string;
  diasSemana?: string[];
  inicio: string;
  fim: string;
}

export class RegraModel {
  private readonly path = '/regras';

  public findById(id: string): Regra | undefined {
    return db.find(this.path, (regraSalva: Regra) => {
      return regraSalva.id === id;
    });
  }

  public create(regra: Regra): Regra | undefined {
    const id = uuid.v4();
    regra.id = id;
    db.push(this.path, [regra], false);
    return this.findById(id);
  }

  public delete(id: string) {
    const regra = db.find(
      this.path,
      (regraSalva: Regra, i: number | string) => {
        if (regraSalva.id === id) {
          const index = Number(i);
          db.delete(`${this.path}[${index}]`);
          return true;
        } else {
          return false;
        }
      }
    );
    return regra;
  }

  public findAll(filter?: RegraFiltro): Regra[] | undefined {
    if (!filter || !filter.fim || !filter.inicio) {
      return db.getData(this.path);
    } else {
      const inicio = moment(filter.inicio, 'DD-MM-YYYY');
      const fim = moment(filter.fim, 'DD-MM-YYYY');
      return db.filter(this.path, (regra: Regra) => {
        const dia = moment(regra.dia, 'DD-MM-YYYY');
        return dia.isBetween(inicio, fim, 'milliseconds', '[]');
      });
    }
  }
}

export const regraModel = new RegraModel();
