import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PackagePreview from './PackagePreview';
import { PackagePreviewSkeleton } from './PackagePreviewSkeleton';
import Container from '../Container/Container';
import { IdentifiedPackage } from '../../../types';

export default {
  title: 'Interface / PackagePreview',
  component: PackagePreview,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PackagePreview>;

const pkg: IdentifiedPackage = {
  name: '@team-griffin/react-heading-section',
  version: '3.0.0 - 4.16.4',
  versionSet: ['3.0.0', '3.0.1', '4.16.4'],
  vulnerabilities: [],
  outdated: false,
  vulnerable: false,
  duplicate: false,
  approximateByteSize: 123456,
  moduleIds: [],
  modules: [],
  registryMetadata: {
    name: '@team-griffin/react-heading-section',
    latestVersion: '4.16.4',
    monthlyDownloads: 1234,
    description: 'The Lodash library exported as ES modules. Generated using lodash-cli',
    fullDescription:
      'Full description: the Lodash library exported as ES modules. Generated using lodash-cli',
    maintainers: [
      { name: 'jdalton', email: 'test@test.com', avatar: 'https://via.placeholder.com/36' },
    ],
    keywords: [
      'ES3',
      'ES5',
      'ES6',
      'ES7',
      'ES2015',
      'ES2016',
      'ES2017',
      'ES2018',
      'ES2019',
      'ES2020',
      'ECMAScript 3',
      'ECMAScript 5',
      'ECMAScript 6',
      'ECMAScript 7',
      'ECMAScript 2015',
      'ECMAScript 2016',
      'ECMAScript 2017',
      'ECMAScript 2018',
      'ECMAScript 2019',
      'ECMAScript 2020',
      'Harmony',
      'Strawman',
      'Map',
      'Set',
      'WeakMap',
      'WeakSet',
      'Promise',
      'Observable',
      'Symbol',
      'TypedArray',
      'URL',
      'URLSearchParams',
      'queueMicrotask',
      'setImmediate',
      'polyfill',
      'ponyfill',
      'shim',
    ],
    versionSpecificValues: {
      '1.0.0': {
        dependencies: {
          'is-buffer': '^2.0.0',
          '@types/unist': '^2.0.0',
          'vfile-message': '^3.0.0',
          'unist-util-stringify-position': '^3.0.0',
        },
        unpackedSize: 60892,
      },
    },
    homepageUrl: 'https://gradejs.com',
    repositoryUrl: 'https://github.com/gradejs/gradejs',
    license: 'MIT',
    updateSeq: 0,
    updatedAt: new Date(),
  } as any,
};

export const ClosedLoading: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreviewSkeleton />
);
export const Closed: ComponentStory<typeof PackagePreview> = () => <PackagePreview pkg={pkg} />;

export const OpenedLoading: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreview pkg={pkg} opened detailsLoading />
);

export const Opened: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreview pkg={pkg} opened />
);

export const InsideContainerClosed: ComponentStory<typeof PackagePreview> = () => (
  <Container>
    <PackagePreview pkg={pkg} />
  </Container>
);

export const InsideContainerOpened: ComponentStory<typeof PackagePreview> = () => (
  <Container>
    <PackagePreview pkg={pkg} opened />
  </Container>
);
