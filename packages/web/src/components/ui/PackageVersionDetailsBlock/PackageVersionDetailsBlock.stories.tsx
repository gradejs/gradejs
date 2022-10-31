import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PackageVersionDetailsBlock from './PackageVersionDetailsBlock';
import Skeleton from '../Skeleton/Skeleton';

export default {
  title: 'Interface / Package Version',
  component: PackageVersionDetailsBlock,
} as ComponentMeta<typeof PackageVersionDetailsBlock>;

export const Default: ComponentStory<typeof PackageVersionDetailsBlock> = (args) => (
  <PackageVersionDetailsBlock {...args} />
);

Default.args = {
  version: '18.2.0',
  updateDate: '2 month ago',
  uses: 23987,
  size: 160,
  modulesCount: 50,
};

export const Opened: ComponentStory<typeof PackageVersionDetailsBlock> = (args) => (
  <PackageVersionDetailsBlock {...args} />
);

Opened.args = {
  version: '18.2.0',
  updateDate: '2 month ago',
  uses: 23987,
  size: 160,
  modulesCount: 50,
};

export const Loading: ComponentStory<typeof PackageVersionDetailsBlock> = () => (
  <Skeleton width='100%' height={100} variant='rounded' />
);
