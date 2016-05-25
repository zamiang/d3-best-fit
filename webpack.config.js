var path = require("path");
var webpack = require("webpack");

module.exports = [
  {
    name: "dist",
    entry:  __dirname + '/example/main.js',
    output: {
      path: __dirname + "/dist",
      filename: 'dist.js'
    },
    resolve: {
      extensions: ['', '.js']
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          },
          exclude: './node_modules'
        }
      ]
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
    ]
  }
];
