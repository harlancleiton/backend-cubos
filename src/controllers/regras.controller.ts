import { Request, Response } from 'express';
import { Regra, regraModel } from '../models/regra.model';

class RegrasController {
  private readonly path = '/regras';

  public async index(req: Request, res: Response) {
    const { inicio, fim } = req.query;
    const atendimentos = regraModel.findAll({ inicio, fim });
    res.json({ data: atendimentos });
  }

  public async store(req: Request, res: Response) {
    const dto: Regra = req.body;
    try {
      const regra = regraModel.create(dto);
      res.send({ data: regra });
    } catch (e) {
      res
        .status(500)
        .send({ error: 'Falha na comunicação com banco de dados' });
    }
  }
}

export default new RegrasController();
