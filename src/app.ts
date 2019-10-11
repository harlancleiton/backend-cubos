import * as cors from 'cors';
import * as express from 'express';
import routes from './routes';

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.express.use(cors());
    this.express.use(express.json());
  }

  private routes() {
    this.express.use(routes);
  }
}

export default new App().express;
