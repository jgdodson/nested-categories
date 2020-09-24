import config from 'config';
import mongoose from 'mongoose';

import Product from './Product';

const url = `mongodb://${config.get('mongo.user')}:${config.get('mongo.pass')}@${config.get('mongo.host')}`;

mongoose.connect(url, { useNewUrlParser: true });

export default {
  Product,
};
