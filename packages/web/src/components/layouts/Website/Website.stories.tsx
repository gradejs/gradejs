import React from 'react';
import Website, { Props } from './Website';

export default {
  title: 'Layouts / Website',
  component: Website,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Ready = (args: Props) => <Website {...args} />;
Ready.args = {
  host: 'fingerprintjs.com',
  webpages: [],
  packages: [
    {
      package: 'react@17.0.2',
    },
    {
      package: 'react-dom@17.0.2',
    },
    {
      package: 'react@17.0.2',
    },
    {
      package: 'react-dom@17.0.2',
    },
    {
      package: 'react@17.0.2',
    },
    {
      package: 'react-dom@17.0.2',
    },
    {
      package: 'react@17.0.2',
    },
    {
      package: 'react-dom@17.0.2',
    },
    {
      package: 'react@17.0.2',
    },
    {
      package: 'react-dom@17.0.2',
    },
  ],
};

export const Pending = (args: Props) => <Website {...args} />;
Pending.args = {
  host: 'fingerprintjs.com',
  webpages: [
    {
      status: 'pending',
    },
  ],
  packages: [],
};

export const Loading = (args: Props) => <Website {...args} />;
Loading.args = {
  host: 'fingerprintjs.com',
  webpages: [],
  packages: [],
};
