import config from 'config';
import express from 'express';
import body_parser from 'body-parser';
import hsts from 'hsts';

// Local imports
import redirect from './middleware/redirect';

// Import Routers
import CategoryRouter from './routes/CategoryRouter';
import ProductRouter from './routes/ProductRouter';

// Import Models
import CategoryModel from './models/Category';
import ProductModel from './models/Product';
import { MongoClient } from 'mongodb';

const AppFactory = (mongoClient: MongoClient) => {
  // Instantiate the App
  const app = express();

  // Router instances
  const categoryRouter = CategoryRouter(new CategoryModel(mongoClient));
  const productRouter = ProductRouter(new ProductModel(mongoClient));

  // In production, trust the Heroku proxy (one level)
  if (config.get('app.proxy.trust')) {
    app.set('trust proxy', config.get('app.proxy.levels'));
  }

  if (config.get('app.www')) {
    app.use(redirect.requireWWW);
  }

  if (config.get('app.https')) {
    app.use(redirect.requireHTTPS);
  }

  // Set the HSTS header
  app.use(
    hsts({
      maxAge: 60 * 60 * 24 * 365,
      includeSubDomains: true,
      preload: true,
    }),
  );

  app.use(body_parser.json());

  /**
   * Routers go here
   *
   * This is where you attach routers for various portions of your API
   */
  app.use('/category', categoryRouter);
  app.use('/product', productRouter);

  return app;
};

export default AppFactory;
