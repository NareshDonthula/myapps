const path = require('path');

module.exports = {
  entry: './src/pushly.js',
  output: {
    filename: 'pushly.js',
    path: path.resolve(__dirname, 'dist')
  }
};