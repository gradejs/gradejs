import React from 'react';
import Home, { Props } from './Home';

export default {
  title: 'Layouts / Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = (args: Props) => <Home {...args} />;
