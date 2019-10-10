import { Request, Response } from 'express';
import { Regra, regraModel } from '../models/regra.model';

class RegrasController {
  public async index(req: Request, res: Response) {
    const { inicio, fim } = req.query;
    const regras = regraModel.findAll({ inicio, fim });
    res.json({ data: regras });
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const regra = regraModel.findById(id);
    if (regra) {
      res.send({ data: regra });
    } else {
      res.status(404).send();
    }
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

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;
    const regra = regraModel.delete(id);
    if (regra) {
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  }
}

export default new RegrasController();
