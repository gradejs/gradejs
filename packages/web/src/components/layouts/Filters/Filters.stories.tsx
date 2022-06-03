import React from 'react';
import Filters, { Props } from './Filters';

export default {
  title: 'Layouts / Filters dropdown',
  component: Filters,
  parameters: {
    layout: 'centered',
  },
};

export const Default = (args: Props) => <Filters {...args} />;
Default.args = {};
