import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PackagePreview from './PackagePreview';
import { PackagePreviewSkeleton } from './PackagePreviewSkeleton';

export default {
  title: 'Interface / PackagePreview',
  component: PackagePreview,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof PackagePreview>;

export const ClosedLoading: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreviewSkeleton />
);
export const Closed: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreview
    name='@team-griffin/react-heading-section'
    version='3.0.0 - 4.16.4'
    desc='The Lodash library exported as ES modules. Generated using lodash-cli'
    problems={['vulnerabilities']}
    keywords={['#moment', '#date', '#time', '#parse', '#format', '#format', '#format']}
    author={{ name: 'jdalton', image: 'https://via.placeholder.com/36' }}
  />
);

export const OpenedLoading: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreview
    name='@team-griffin/react-heading-section'
    version='3.0.0 - 4.16.4'
    desc='The Lodash library exported as ES modules. Generated using lodash-cli'
    problems={['vulnerabilities']}
    keywords={['#moment', '#date', '#time', '#parse', '#format', '#format', '#format']}
    author={{ name: 'jdalton', image: 'https://via.placeholder.com/36' }}
    opened
    detailsLoading
  />
);

export const Opened: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreview
    name='@team-griffin/react-heading-section'
    version='3.0.0 - 4.16.4'
    desc='The Lodash library exported as ES modules. Generated using lodash-cli'
    problems={['vulnerabilities']}
    keywords={['#moment', '#date', '#time', '#parse', '#format', '#format', '#format']}
    author={{ name: 'jdalton', image: 'https://via.placeholder.com/36' }}
    opened
  />
);
