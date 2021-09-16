import React from 'react';
import Button, { Props } from './Button';

export default {
  title: 'Interface / Button',
  component: Button,
}

export const Default = (args: Props) => <Button {...args} />
Default.args = {
  children: 'Button'
}
