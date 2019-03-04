const merge = require('webpack-merge');
const base = require('./parts/base');
const loaders = require('./parts/loaders');
const watch = require('./parts/watch');
const externals = require('./parts/externals');

module.exports = function(env, argv) {
  return merge(base(argv), loaders(argv), watch(argv), externals());
};
