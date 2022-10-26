import cluster from 'node:cluster';
import os from 'node:os';
import Redis from 'ioredis';

const IS_DEV = process.env.NODE_ENV !== 'production';

function messageHandler({ cmd }) {
  if (cmd === 'ok') {
    console.log('cmd', cmd);
  }
}

export default async function master() {
  const workersNum = IS_DEV ? 1 : os.cpus().length;

  for (let i = 0; i < workersNum; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id]?.on('message', msg => {
      messageHandler(msg);
    });
  }

  const redis = new Redis();

  // 订阅 redis 消息
  redis.subscribe('deploy', (err, count) => {
    if (err) {
      console.log(err);
    }
    console.log('订阅 channel 成功 count', count);
  });

  redis.on('message', (channel, message) => {
    console.log(`Received ${message} from ${channel}`);
  });
}
