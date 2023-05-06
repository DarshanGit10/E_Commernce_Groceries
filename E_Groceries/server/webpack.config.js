// webpack.config.js

module.exports = {
    // other Webpack options...
    
    resolve: {
      fallback: {
        util: require.resolve('util/'),
        "stream": require.resolve("stream-browserify")
      }
    }
  };
  