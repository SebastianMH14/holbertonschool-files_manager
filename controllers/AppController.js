import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  static getStatus(req, res) {
    const dbAlive = dbClient.isAlive();
    const redisAlive = redisClient.isAlive();
    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  static async getStats(req, res) {
    const usersC = await dbClient.nbUsers();
    const filesC = await dbClient.nbFiles();
    res.status(200).json({ users: usersC, files: filesC });
  }
}
