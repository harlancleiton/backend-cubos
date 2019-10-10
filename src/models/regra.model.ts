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
  diasSemana?: number[];
  inicio: string;
  fim: string;
}

export class RegraModel {
  private readonly path = '/regras';

  /**
   * Busca uma regra de atendimento por id
   * @param id no formato UUID
   * @returns {Regra} encontrada no banco de dados
   */
  public findById(id: string): Regra | undefined {
    return db.find(this.path, (regraSalva: Regra) => {
      return regraSalva.id === id;
    });
  }

  /**
   * Persiste uma nova regra no banco de dados
   * @param regra objeto a ser persistido
   * @returns {Regra} salva no banco de dados
   */
  public create(regra: Regra): Regra | undefined {
    const id = uuid.v4();
    regra.id = id;
    db.push(this.path, [regra], false);
    return this.findById(id);
  }

  /**
   * Busca e apaga uma regra de atendimento por id
   * @param id no formato UUID
   * @returns {boolean} retorna se a Regra foi encontrada e excluida
   */
  public delete(id: string): boolean {
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
    return !!regra;
  }

  /**
   * Lista todas as regras de atendimento
   * @param filter parametro opcional que pode servir de filtro da busca
   * @returns {Regra[]} retorna um array de regras de atendimento encontradas
   */
  public findAll(filter?: RegraFiltro): Regra[] | undefined {
    if (!filter || !filter.fim || !filter.inicio) {
      return db.getData(this.path);
    } else {
      const inicio = moment(filter.inicio, 'DD-MM-YYYY');
      const fim = moment(filter.fim, 'DD-MM-YYYY');
      return db.filter(this.path, (regra: Regra) => {
        if (regra.tipo === RegraTipo.DIARIO) {
          return this.filtrarDiario(regra);
        } else if (regra.tipo === RegraTipo.ESPECIFICO) {
          return this.filtrarEspecifico(regra, inicio, fim);
        } else {
          return this.filtrarSemanal(regra, inicio, fim);
        }
      });
    }
  }

  /**
   * Verifica se a regra pode passar ou não pelo filtro
   * @param regra a ser filtrada
   * @returns {boolean}
   */
  filtrarDiario(regra: Regra): boolean {
    if (regra.tipo !== RegraTipo.DIARIO) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Verifica se a regra pode passar ou não pelo filtro
   * @param regra a ser filtrada
   * @param inicio data inicial do filtro
   * @param fim data final do filtro
   * @returns {boolean}
   */
  filtrarEspecifico(
    regra: Regra,
    inicio: moment.Moment,
    fim: moment.Moment
  ): boolean {
    if (regra.tipo !== RegraTipo.ESPECIFICO) {
      return false;
    } else {
      const dia = moment(regra.dia, 'DD-MM-YYYY');
      return dia.isBetween(inicio, fim, 'milliseconds', '[]');
    }
  }

  /**
   * Verifica se a regra pode passar ou não pelo filtro
   * @param regra a ser filtrada
   * @param inicio data inicial do filtro
   * @param fim data final do filtro
   * @returns {boolean}
   */
  filtrarSemanal(
    regra: Regra,
    inicio: moment.Moment,
    fim: moment.Moment
  ): boolean {
    if (regra.tipo !== RegraTipo.SEMANAL) {
      return false;
    } else {
      const dias: number[] = regra.diasSemana!;
      const diff = fim.diff(inicio, 'days');
      if (diff === 0) {
        /**
         * se o inicio e fim forem iguais basta retornar se inicio ou fim está
         * incluso no array
         */
        return dias.includes(inicio.days());
      } else {
        /**
         * moment.days() retorna o dia da semana para aquela data,
         * sendo 0 para domingo e 6 para sábado
         */
        let f = fim.days();
        const i = inicio.days();
        /**
         * se o dia da semana correspondente a data final for menor que o dia
         * da data inicial é porque o filtro é maior que 7 dias, nesse caso
         * igualamos o dia final a 6
         */
        if (f < i || diff > 6) {
          f = 6;
        }
        // por padrão retornaremos false
        let aux: boolean = false;
        /**
         * percorremos todos os dias da semana informados no filtro e
         * verificamos se algum desses está no array de dias da regra
         * caso esteja interrompemos a execução do for e retornamos true
         */
        for (let x = f; x >= i; x--) {
          if (dias.includes(x)) {
            aux = true;
            break;
          }
        }
        return aux;
      }
    }
  }
}

export const regraModel = new RegraModel();
