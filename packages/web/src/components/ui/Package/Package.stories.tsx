import React from 'react';
import Package, { Props } from './Package';

export default {
  title: 'Interface / Package',
  component: Package,
  parameters: {
    layout: 'centered',
  },
};

export const Default = (args: Props) => <Package {...args} />;
Default.args = {
  variant: 'grid',
  pkg: {
    packageName: 'react',
    packageVersionRange: '17.0.0 - 17.0.2',
    packageMetadata: {
      approximateByteSize: 2352,
    },
  },
};
