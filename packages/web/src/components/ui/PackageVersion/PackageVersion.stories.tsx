import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PackageVersion from './PackageVersion';
import Skeleton from '../Skeleton/Skeleton';

export default {
  title: 'Interface / Package Version',
  component: PackageVersion,
} as ComponentMeta<typeof PackageVersion>;

export const Default: ComponentStory<typeof PackageVersion> = (args) => (
  <PackageVersion {...args} />
);

Default.args = {
  version: '18.2.0',
  updateDate: '2 month ago',
  uses: 23987,
  size: 160,
  modulesCount: 50,
};

export const Opened: ComponentStory<typeof PackageVersion> = (args) => <PackageVersion {...args} />;

Opened.args = {
  version: '18.2.0',
  updateDate: '2 month ago',
  uses: 23987,
  size: 160,
  modulesCount: 50,
};

export const Loading: ComponentStory<typeof PackageVersion> = () => (
  <Skeleton width='100%' height={100} variant='rounded' />
);