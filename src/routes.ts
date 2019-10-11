import { Router } from 'express';
import horariosController from './controllers/horarios.controller';
import regrasController from './controllers/regras.controller';
import regrasValidator from './controllers/validators/regras.validator';

const routes = Router();

routes.post('/regras', [regrasValidator.store, regrasController.store]);
routes.get('/regras', regrasController.index);
routes.get('/regras/:id', regrasController.show);
routes.delete('/regras/:id', regrasController.destroy);

routes.get('/horarios', horariosController.index);

export default routes;
