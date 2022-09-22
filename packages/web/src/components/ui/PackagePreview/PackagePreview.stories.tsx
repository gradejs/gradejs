import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PackagePreview from './PackagePreview';
import { PackagePreviewSkeleton } from './PackagePreviewSkeleton';
import { IdentifiedPackage } from 'store/selectors/websiteResults';

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
  outdated: false,
  vulnerable: false,
  duplicate: false,
  approximateByteSize: 123456,
  moduleIds: [],
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
    keywords: ['#moment', '#date', '#time', '#parse', '#format', '#format', '#format'],
    versionSpecificValues: {},
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
