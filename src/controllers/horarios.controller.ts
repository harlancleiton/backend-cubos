import { Request, Response } from 'express';
import { horarioModel } from '../models/horario.model';

class HorariosController {
  public index(req: Request, res: Response) {
    const { inicio, fim } = req.query;
    const horarios = horarioModel.findAll({ inicio, fim });
    res.send({ data: horarios });
  }
}

export default new HorariosController();
