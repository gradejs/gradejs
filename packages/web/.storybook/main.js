const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.modules.push(path.resolve(__dirname, '../src'));

    config.module.rules.push({
      test: /\.module\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              exportLocalsConvention: 'camelCase',
            },
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.scss$/,
      exclude: /\.module.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: false,
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    });

    return config;
  },
};
