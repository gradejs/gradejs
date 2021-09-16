const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcDir = 'src';
const distDir = 'dist';

module.exports = (_, argv) => {
  const { mode = 'development' } = argv;
  const isDevelopment = mode === 'development';

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
        {
          test: /\.module\.scss$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: isDevelopment,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },
        {
          test: /\.s?css$/,
          exclude: /\.module.scss$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css',
      }),
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
