import { Router } from 'express';
import regrasController from './controllers/regras.controller';

const routes = Router();

routes.post('/regras', regrasController.store);
routes.get('/regras', regrasController.index);
routes.delete('/regras/:id', regrasController.destroy);

export default routes;
