import dotenv from 'dotenv';

// Read .env file
dotenv.config();

import config from 'config';
import app from './app';

const port = config.get<number>('app.port');

app.listen(port, (err) => {

  if (err) {
    console.error('Error during server startup:', err);
  }

  console.log(`server listening on port [${port}]`);
});
