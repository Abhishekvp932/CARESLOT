import redisClient from '../config/redisClient';
import logger from './logger';

export async function acquireLock(
  lockKey: string,
  ttl = 5000
): Promise<boolean> {
  const result = await redisClient.set(lockKey, 'locked', {
    NX: true,
    PX: ttl,
  });
  logger.info('redis lock result');
  logger.debug(result);
  return result === 'OK';
}

export async function releaseLock(lockKey: string): Promise<void> {
  await redisClient.del(lockKey);
}
