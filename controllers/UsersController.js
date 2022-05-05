import sha1 from 'sha1';
import mongodb from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class Users {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const user = await dbClient.client
      .db('files_manager')
      .collection('users')
      .findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hash = sha1(password);
    const newUser = await dbClient.client
      .db('files_manager')
      .collection('users')
      .insert({ email, password: hash });
    return res
      .status(201)
      .json({ id: newUser.ops[0]._id, email: newUser.ops[0].email });
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const user = await redisClient.get(`auth_${token}`);
    // console.log(user);
    if (user) {
      const id = new mongodb.ObjectID(user);
      const result = await dbClient.client
        .db('files_manager')
        .collection('users')
        .findOne({ _id: id });
      if (result) {
        return res.status(200).json({ id: result._id, email: result.email });
      }
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
