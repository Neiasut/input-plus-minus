module.exports = ({ ...args }) => {
  const env = args[2];
  return {
    plugins: {
      'postcss-preset-env': {
        browsers:
          process.env.NODE_ENV === 'development'
            ? 'last 2 versions'
            : ['last 2 versions', 'iOS >= 8', 'IE >= 8']
      }
    }
  };
};
