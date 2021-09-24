import React from 'react';
import Error, { Props } from './Error';

export default {
  title: 'Layouts / Error',
  component: Error,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = (args: Props) => <Error {...args} />;
Default.args = {
  host: 'example.com',
};
