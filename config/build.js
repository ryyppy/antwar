'use strict';
var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var getCommon = require('./common');


module.exports = function(config) {
  var cwd = process.cwd();

  var themeConfig = config.themeConfig && config.themeConfig.build;

  return getCommon(config).then(function(common) {
    return {
      name: 'server',
      target: 'node',
      context: path.join(__dirname, '..', './'),
      entry: {
        bundlePage: './dev/page.js',
        // XXX: inject via rss via a plugin
        //bundleStaticRss: './dev/staticRss.js',
        bundleStaticPage: './dev/staticPage.js',
        paths: './dev/exportPaths.js',
      },
      output: {
        path: path.join(cwd, './.antwar/build'),
        filename: '[name].js',
        publicPath: path.join(cwd, './.antwar/build'),
        libraryTarget: 'commonjs2',
      },
      plugins: common.plugins.concat([
        new ExtractTextPlugin('main.css', {
          allChunks: true,
        })
      ]),
      resolve: common.resolve,
      resolveLoader: common.resolveLoader,
      module: {
        loaders: [
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract(
              'style-loader',
              'css-loader!autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}!sass-loader'),
          },
          {
            test: /\.jsx?$/,
            loader: 'jsx-loader?harmony',
          },
          {
            test: /\.coffee$/,
            loader: 'coffee-loader',
          },
          {
            test: /\.html$/,
            loader: 'raw',
          },
          {
            test: /\.md$/,
            loader: 'json!yaml-frontmatter-loader',
          }
        ].concat(themeConfig.module && themeConfig.module.loaders? themeConfig.module.loaders: []),
        jshint: common.jshint,
      }
    };
  });
};
