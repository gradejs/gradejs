import React from 'react';
import PackageSkeleton, { Props } from './PackageSkeleton';

export default {
  title: 'Interface / PackageSkeleton',
  component: PackageSkeleton,
  parameters: {
    layout: 'centered',
  },
};

export const Cell = (args: Props) => <PackageSkeleton {...args} />;
