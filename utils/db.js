const { MongoClient } = require('mongodb');

const HOST = process.env.MONGO_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
export const DB_NAME = process.env.DB_DATABASE || 'files_manager';

class DBClient {
  constructor() {
    this.client = new MongoClient(`mongodb://${HOST}:${PORT}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client.connect();
  }

  isAlive() {
    const status = this.client.isConnected();
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
