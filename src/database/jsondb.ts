import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

class Database {
  public db: JsonDB;

  constructor() {
    const db: JsonDB = new JsonDB(
      new Config(process.env.DATABASE || 'db.json', true, true, '/')
    );
    this.db = db;
  }
}

export default new Database().db;
