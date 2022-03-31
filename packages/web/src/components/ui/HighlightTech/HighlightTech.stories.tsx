import React from 'react';
import webpackIcon from 'assets/icons/webpack.svg';
import HighlightTech, { Props } from './HighlightTech';

export default {
  title: 'Interface / Highlight Tech',
  component: HighlightTech,
  parameters: {
    layout: 'centered',
  },
};

export const Default = (args: Props) => <HighlightTech {...args} />;
Default.args = {
  description: 'Source build system',
  title: 'Webpack',
  icon: webpackIcon,
};
