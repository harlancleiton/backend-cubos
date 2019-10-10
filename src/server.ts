import * as dotenv from 'dotenv';

const path = `${process.env.NODE_ENV || 'development'}.env`;

dotenv.config({ path });

import app from './app';

app.listen(process.env.PORT);
