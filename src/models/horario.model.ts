import * as moment from 'moment';
import { Horario, Intervalo, Regra, RegraFiltro } from '../dto';
import { RegraTipo } from './regra-tipo.enum';
import { regraModel } from './regra.model';

class HorarioModel {
  findAll(filter: RegraFiltro): Horario[] {
    const regras: Regra[] | undefined = regraModel.findAll(filter);
    const horarios: Horario[] = [];

    if (!regras) {
      return horarios;
    }

    const inicio = moment(filter.inicio, 'DD-MM-YYYY');
    const fim = moment(filter.fim, 'DD-MM-YYYY');
    const diasPesquisa: moment.Moment[] = this.getEnumerarDatas(inicio, fim);

    diasPesquisa.forEach(diaPesquisa => {
      const dia = diaPesquisa.format('DD-MM-YYYY');
      const horario: Horario = { dia, intervalos: [] };
      regras.forEach(regra => {
        if (regra.tipo === RegraTipo.DIARIO) {
          horario.intervalos.push({ inicio: regra.inicio, fim: regra.fim });
        } else if (regra.tipo === RegraTipo.ESPECIFICO) {
          const regraDia = moment(regra.dia, 'DD-MM-YYYY');
          if (regraDia.diff(diaPesquisa, 'days') === 0) {
            horario.intervalos.push({ inicio: regra.inicio, fim: regra.fim });
          }
        } else {
          const diaSemana = moment(dia, 'DD-MM-YYYY').days();
          if (regra.diasSemana!.includes(diaSemana)) {
            horario.intervalos.push({ inicio: regra.inicio, fim: regra.fim });
          }
        }
      });
      if (horario.intervalos.length > 0) {
        horarios.push(horario);
      }
    });

    return horarios;
  }

  getEnumerarDatas(inicio: moment.Moment, fim: moment.Moment): moment.Moment[] {
    const datas: moment.Moment[] = [];

    while (fim.diff(inicio, 'days') >= 0) {
      datas.push(inicio.clone());
      inicio = inicio.add(1, 'days');
    }

    return datas;
  }
}

export const horarioModel = new HorarioModel();
