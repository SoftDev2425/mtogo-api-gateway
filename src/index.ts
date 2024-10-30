import dotenv from 'dotenv';
import createServer from './utils/server';
import { redisClient } from './redis/client';

dotenv.config();

export const app = createServer();
const port = process.env.PORT || 8000;

async function main() {
  app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await redisClient.connect();
    redisClient.on('error', () =>
      console.log('Connection to redis server failed'),
    );
  })
  .catch(async e => {
    console.error(e);
    process.exit(1);
  });
