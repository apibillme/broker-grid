var path = require('path');
module.exports = {
  entry: './src/index.js',
  mode: 'production',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  externals: {
    'react': 'commonjs react' 
  }
};
