import { join } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { configCommon, pluginsCommon, srcDir } from './common';
import { Configuration } from 'webpack';
import { WebpackConfigOptions } from './config';
import nodeExternals from 'webpack-node-externals';

const distDir = 'dist';

export const serverConfig: (options: WebpackConfigOptions) => Configuration = ({
  mode,
  watch = false,
}) => ({
  entry: join(__dirname, '..', srcDir, 'server.tsx'),
  ...configCommon(mode),
  devtool: mode === 'production' ? 'source-map' : 'inline-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff(2)?|ttf|eot)$/i,
        exclude: /sprite\/([^\/]*)\.svg$/,
        use: 'null-loader',
      },
      {
        test: /sprite\/([^\/]*)\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'sprite.svg',
        },
      },
      {
        test: /\.(tsx|ts)?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.s?css$/,
        exclude: /\.module.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    ...pluginsCommon(mode, true),
    new CopyPlugin({
      patterns: [
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'robots.staging.txt', to: 'robots.staging.txt' },
      ],
    }),
  ],
  output: {
    filename: '[name].js',
    path: join(__dirname, '..', distDir),
    library: { type: 'commonjs2' },
    globalObject: 'this',
  },
  optimization: {
    minimize: false,
  },
  target: 'node',
  externals: ['react-helmet', nodeExternals() as any],
  watch,
});
