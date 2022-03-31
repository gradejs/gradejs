import React from 'react';
import Package, { Props } from './Package';

export default {
  title: 'Interface / Package',
  component: Package,
  parameters: {
    layout: 'centered',
  },
};

export const Cell = (args: Props) => <Package {...args} />;
Cell.args = {
  variant: 'cell',
  name: 'react',
  version: '17.0.2',
};

export const Row = (args: Props) => (
  <div style={{ width: '90vw' }}>
    <Package {...args} />
  </div>
);
Row.args = {
  variant: 'row',
  name: 'react',
  version: '17.0.2',
};
