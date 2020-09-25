import config from 'config';
import express from 'express';
import session from 'express-session';
import connect_redis from 'connect-redis';
import body_parser from 'body-parser';
import path from 'path';
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

  const RedisStore = connect_redis(session);

  const store_options = {
    url: process.env.REDIS_URL,
  };

  // Configure the sessions
  const session_options = {
    name: config.get<string>('cookie.name'),
    store: new RedisStore(store_options),
    secret: config.get<string>('cookie.secret'),
    resave: false,
    saveUninitialized: false,

    // This value is inferred from app.get('trust proxy')
    //proxy: isProd,

    cookie: {
      // 30 days
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: true,
      secure: config.get<boolean>('cookie.secure'),
    },
  };

  // Session middleware
  app.use(session(session_options));

  /**
   * Routers go here
   *
   * This is where you attach routers for various portions of your API
   */
  app.use('/category', categoryRouter);
  app.use('/product', productRouter);

  // Serve static files in production
  if (config.get('app.serveStaticBuild')) {
    // Static assets
    app.use(express.static(path.join(__dirname, './../../web/build')));

    // Send app shell for non-api requests
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(__dirname, './../../web/build/index.html'));
    });
  }

  return app;
};

export default AppFactory;
