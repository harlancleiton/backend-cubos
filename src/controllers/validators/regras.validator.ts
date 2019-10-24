import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment';
import { Regra } from '../../dto';
import { regraModel } from '../../models/regra.model';

class RegrasValidator {
  store(req: Request, res: Response, next: NextFunction) {
    const dto: Regra = req.body;
    let regras: Regra[];
    try {
      regras = regraModel.findAll()!;
    } catch (e) {
      regras = [];
    }
    const inicio = moment(dto.inicio, 'HH:mm');
    const fim = moment(dto.fim, 'HH:mm');

    let valido: boolean = true;

    for (const regra of regras) {
      const regraInicio = moment(regra.inicio, 'HH:mm');
      const regraFim = moment(regra.fim, 'HH:mm');
      if (
        regraInicio.isBetween(inicio, fim, 'milliseconds', '[]') ||
        regraFim.isBetween(inicio, fim, 'milliseconds', '[]')
      ) {
        valido = false;
        break;
      }
    }

    if (valido) {
      next();
    } else {
      res.status(400).send({
        message: 'O horário informado conflita com uma regra existente',
      });
    }
  }
}

export default new RegrasValidator();
