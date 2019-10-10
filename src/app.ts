import * as express from 'express';
import routes from './routes';

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  // TODO habilitar cors
  private middlewares() {
    this.express.use(express.json());
  }

  private routes() {
    this.express.use(routes);
  }
}

export default new App().express;
