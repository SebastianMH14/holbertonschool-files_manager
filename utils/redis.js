const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.log(`Error ${err}`);
    });
  }

  isAlive() {
    const status = this.client.connected;
    if (status) {
      return true;
    }
    return false;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const res = await getAsync(key);
    return res;
  }

  async set(key, value, expire) {
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, value, 'EX', expire);
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
