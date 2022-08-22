import { join } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { configCommon, pluginsCommon, srcDir } from './common';
import { Configuration } from 'webpack';

const distDir = 'dist';

export const serverConfig: (mode: 'development' | 'production', watch: boolean) => Configuration = (
  mode,
  watch
) => ({
  entry: join(__dirname, '..', srcDir, 'server.tsx'),
  ...configCommon(mode),
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
  plugins: pluginsCommon(mode, true),
  output: {
    filename: '[name].js',
    path: join(__dirname, '..', distDir),
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  target: 'node',
  watch,
});
