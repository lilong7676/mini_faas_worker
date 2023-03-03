const IS_DEV = process.env.NODE_ENV === 'development';

module.exports = {
  reactStrictMode: false,
  basePath: IS_DEV ? '' : '/mini_faas_worker',
};
