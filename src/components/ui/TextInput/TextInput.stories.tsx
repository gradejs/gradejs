import React from 'react';
import TextInput, { Props } from './TextInput';

export default {
  title: 'Interface / TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
};

export const Default = (args: Props) => <TextInput {...args} />;
Default.args = {
  placeholder: 'placeholder',
};
