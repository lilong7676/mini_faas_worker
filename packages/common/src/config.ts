export const APP_NAME = 'mini_faas_worker';
/**
 * serverless service port
 */
export const ServerlessPort = 9102;

/**
 * gateway service port
 */
export const GatewayPort = 9101;

export function getRedisConfig() {
  const IS_DEV = process.env.NODE_ENV === 'development';
  return {
    host: IS_DEV ? 'localhost' : '172.17.0.1',
    port: 6379,
  };
}
