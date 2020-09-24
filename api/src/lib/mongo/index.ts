import config from 'config';
import { MongoClient } from 'mongodb';

const url = `mongodb://${config.get('mongo.user')}:${config.get('mongo.pass')}@${config.get('mongo.host')}`;

const mongoClientPromise: Promise<MongoClient> = MongoClient.connect(url);

export default mongoClientPromise;
