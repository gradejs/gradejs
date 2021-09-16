const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcDir = 'src';
const distDir = 'dist';

module.exports = (_, argv) => {
  const { mode = 'development' } = argv;

  return {
    mode,
    entry: path.join(__dirname, srcDir, 'index.tsx'),
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [path.resolve(__dirname, srcDir), 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts)?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, distDir),
      },
      compress: true,
      port: 3000,
    },
    output: {
      filename: 'bundle.[fullhash].js',
      path: path.resolve(__dirname, distDir),
      publicPath: '/',
    },
  };
};
