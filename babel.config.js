module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  const presets = ['@babel/typescript', '@babel/preset-env'];
  const plugins = ['@babel/plugin-proposal-class-properties'];

  return {
    presets,
    plugins
  };
};
