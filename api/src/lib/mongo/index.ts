import config from 'config';
import { MongoClient } from 'mongodb';

const url = `mongodb://${config.get('mongo.user')}:${config.get('mongo.pass')}@${config.get('mongo.host')}`;

const mongoClient = MongoClient.connect(url);

export default mongoClient;
