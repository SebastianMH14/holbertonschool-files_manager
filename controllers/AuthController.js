import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(req, res) {
    const { authorization } = req.headers;
    const data = authorization.split(' ');
    const buffer = Buffer.from(data[1], 'base64');
    const user = buffer.toString('utf8').split(':');

    const hash = sha1(user[1]);

    const finduser = await dbClient.client
      .db('files_manager')
      .collection('users')
      .findOne({ email: user[0], password: hash });
    if (!finduser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = uuidv4();

    const key = `auth_${token}`;
    redisClient.set(key, finduser._id, 86400);

    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    console.log(token);
    const user = redisClient.get(`auth_${token}`);
    if (user) {
      redisClient.del(`auth_${token}`);
      return res.status(200).json({ message: 'Disconnected' });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
