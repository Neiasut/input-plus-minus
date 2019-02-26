const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const functions = require('./functions');
const rootPath = functions.getRootPath();

module.exports = function(argv) {
  const prod = functions.checkProd(argv);
  const outputDirectory = rootPath + (prod ? '/public' : '/dist');
  const devTool = prod ? false : 'source-map';
  const nameCss = prod ? '[name].min.css' : '[name].css';
  let plugins = [
    new MiniCssExtractPlugin({
      filename: nameCss
    })
  ];
  if (!functions.checkWatch(argv)) {
    plugins.unshift(
      new CleanWebpackPlugin([outputDirectory], {
        allowExternal: true
      })
    );
  }

  return {
    mode: argv.mode,
    devtool: devTool,
    entry: {
      InputPlusMinus: rootPath + '/src/InputPlusMinus.ts',
      InputPlusMinusWindow: rootPath + '/src/InputPlusMinusWindow.ts'
    },
    output: {
      filename: '[name].js',
      path: outputDirectory
    },
    plugins: plugins,
    resolve: {
      extensions: ['.ts', '.js', '.json']
    }
  };
};
