module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  const presets = ['@babel/preset-env', '@babel/typescript'];

  return {
    presets
  };
};
