export const environment = {
  database: process.env.DATABASE_JSON || 'db.json',
  server: { port: process.env.PORT || 3333 },
};
