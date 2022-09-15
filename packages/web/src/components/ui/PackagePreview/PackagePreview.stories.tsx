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
  <PackagePreview name='name' version='1.0.0' />
);

export const OpenedLoading: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreview name='name' version='1.0.0' opened detailsLoading />
);

export const Opened: ComponentStory<typeof PackagePreview> = () => (
  <PackagePreview name='name' version='1.0.0' opened />
);
