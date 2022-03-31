import React from 'react';
import webpackIcon from 'assets/icons/webpack.svg';
import Website, { Props } from './Website';

export default {
  title: 'Layouts / Website',
  component: Website,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = (args: Props) => <Website {...args} />;
Default.args = {
  host: 'fingerprintjs.com',
  highlights: [
    {
      description: 'Source build system',
      title: 'Webpack',
      icon: webpackIcon,
    },
  ],
  packages: [
    {
      name: 'react',
      version: '17.0.2',
    },
    {
      name: 'react-dom',
      version: '17.0.2',
    },
    {
      name: 'react',
      version: '17.0.2',
    },
    {
      name: 'react-dom',
      version: '17.0.2',
    },
    {
      name: 'react',
      version: '17.0.2',
    },
    {
      name: 'react-dom',
      version: '17.0.2',
    },
    {
      name: 'react',
      version: '17.0.2',
    },
    {
      name: 'react-dom',
      version: '17.0.2',
    },
    {
      name: 'react',
      version: '17.0.2',
    },
    {
      name: 'react-dom',
      version: '17.0.2',
    },
    {
      name: 'react',
      version: '17.0.2',
    },
    {
      name: 'react-dom',
      version: '17.0.2',
    },
  ],
};
