import * as moment from 'moment';
import { Regra, RegraFiltro } from '../../src/dto';
import { RegraTipo } from '../../src/models/regra-tipo.enum';
import { regraModel } from '../../src/models/regra.model';

describe('Regra de Atendimento', () => {
  it('Deve retornar se uma regra faz parte do filtro', () => {
    const filtro: RegraFiltro = { inicio: '20-10-2019', fim: '21-10-2019' };
    const regra: Regra = {
      fim: '16:00',
      inicio: '15:00',
      tipo: RegraTipo.DIARIO,
    };
    regraModel.create(regra);
    const regras = regraModel.findAll(filtro);
    expect(regras).toContain(regra);
  });

  it('Deve retornar se uma regra diária faz parte do filtro', () => {
    const regra: Regra = {
      fim: '16:00',
      inicio: '15:00',
      tipo: RegraTipo.DIARIO,
    };
    const fazParte = regraModel.filtrarDiario(regra);
    expect(fazParte).toEqual(true);
  });

  it('Deve retornar se uma regra específica faz parte do filtro', () => {
    const inicio = moment('20-10-2019', 'DD-MM-YYYY');
    const fim = moment('21-10-2019', 'DD-MM-YYYY');
    const regra: Regra = {
      dia: '20-10-2019',
      fim: '16:00',
      inicio: '15:00',
      tipo: RegraTipo.ESPECIFICO,
    };
    const fazParte = regraModel.filtrarEspecifico(regra, inicio, fim);
    expect(fazParte).toEqual(true);
  });

  it('Deve retornar se uma regra semanal faz parte do filtro', () => {
    const inicio = moment('20-10-2019', 'DD-MM-YYYY');
    const fim = moment('21-10-2019', 'DD-MM-YYYY');
    const regra: Regra = {
      diasSemana: [1],
      fim: '16:00',
      inicio: '15:00',
      tipo: RegraTipo.SEMANAL,
    };
    const fazParte = regraModel.filtrarSemanal(regra, inicio, fim);
    expect(fazParte).toEqual(true);
  });
});
