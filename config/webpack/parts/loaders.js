const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const functions = require('./functions');

module.exports = function(argv) {
  return {
    module: {
      rules: [
        {
          test: /\.ts?$/,
          exclude: /node_modules/,
          use: ['ts-loader']
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            functions.checkWatch(argv)
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    }
  };
};
