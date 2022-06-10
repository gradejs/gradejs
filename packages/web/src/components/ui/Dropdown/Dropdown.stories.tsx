import React from 'react';
import Dropdown, { Props } from './Dropdown';
import { Button } from '../index';

export default {
  title: 'Interface / Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
};

export const Default = (args: Props) => (
  <Dropdown {...args}>
    <div>some content</div>
    <div>some content</div>
    <div>some content</div>
  </Dropdown>
);
Default.args = {
  children: 'Dropdown',
  TriggerComponent: Button,
  triggerChildren: 'Filter',
};
