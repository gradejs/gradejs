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
  packages: [
    {
      name: 'react',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
      registryMetadata: {
        latestVersion: '18.0.0',
        description: 'Test description',
        repositoryUrl: 'https://github.com',
        homepageUrl: 'https://github.com/test',
        monthlyDownloads: 1,
      },
    },
    {
      name: 'react-dom',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react-dom',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react-dom',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react-dom',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
    {
      name: 'react-dom',
      versionSet: ['17.0.2'],
      versionRange: '17.0.2',
    },
  ],
  vulnerabilities: {
    react: [
      {
        affectedPackageName: 'react',
        affectedVersionRange: '>=17.0.0 <18.0.0',
        osvId: 'GRJS-test-id-1',
        detailsUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        summary: 'Test vulnerability 1 summary',
        severity: 'HIGH',
      },
      {
        affectedPackageName: 'react',
        affectedVersionRange: '>=17.0.0 <18.0.0',
        osvId: 'GRJS-test-id-2',
        detailsUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        summary: 'Test vulnerability 2 summary',
        severity: 'LOW',
      },
    ],
  },
};

export const Pending = (args: Props) => <Website {...args} />;
Pending.args = {
  host: 'gradejs.com',
  packages: [],
  isLoading: false,
  isPending: true,
};

export const Loading = (args: Props) => <Website {...args} />;
Loading.args = {
  host: 'gradejs.com',
  packages: [],
  isLoading: true,
  isPending: false,
};
