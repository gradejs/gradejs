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
  host: 'gradejs.com',
  webpages: [],
  packages: [
    {
      packageName: 'react',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react-dom',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react-dom',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react-dom',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react-dom',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
    {
      packageName: 'react-dom',
      possiblePackageVersions: ['17.0.2'],
      packageVersionRange: '17.0.2'
    },
  ],
};

export const Pending = (args: Props) => <Website {...args} />;
Pending.args = {
  host: 'gradejs.com',
  webpages: [
    {
      status: 'pending',
    },
  ],
  packages: [],
};

export const Loading = (args: Props) => <Website {...args} />;
Loading.args = {
  host: 'gradejs.com',
  webpages: [],
  packages: [],
};
