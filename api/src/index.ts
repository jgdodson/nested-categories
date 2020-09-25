import dotenv from 'dotenv';

// Read .env file
dotenv.config();

import config from 'config';
import AppFactory from './app';

import mongoClientPromise from './lib/mongo';

const port = config.get<number>('app.port');

mongoClientPromise
  .then((mongoClient) => {
    const app = AppFactory(mongoClient);

    app.listen(port, (err) => {
      if (err) {
        console.error('Error during server startup:', err);
        return;
      }

      console.log(`server listening on port [${port}]`);
    });
  })
  .catch((err) => {
    console.error('Error while connecting to mongo', err);
    return;
  });
