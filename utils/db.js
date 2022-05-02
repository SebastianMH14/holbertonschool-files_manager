const { MongoClient } = require('mongodb');
const { promisify } = require('util');

const HOST = process.env.MONGO_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    this.client = MongoClient.connect(`mongodb://${HOST}:${PORT}/`);
    this.client.connect();
    const db = this.client.db(DB_NAME);
  }

  isAlive() {
    const status = this.client.connected;
    if (status) {
      return true;
    }
    return false;
  }

  async nbUsers() {
    const collection = this.client.db(DB_NAME).collection('users');
    const res = await collection.countDocuments();
    return res;
  }

  async nbFiles() {
    const collection = this.client.db(DB_NAME).collection('files');
    const res = await collection.countDocuments();
    return res;
  }
}

const dbClient = new DBClient();

export default dbClient;
