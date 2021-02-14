// webpack all takes js code and bundles it together into one file to the browser
// configuration for webpack
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",  // relative path
  output: {
    path: path.resolve(__dirname, "./static/frontend"), // gets current dirctory (frontened directory)
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: true, // minimizing js to minimize time for it to load in browser
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};