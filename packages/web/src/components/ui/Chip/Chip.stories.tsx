import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Chip from './Chip';

export default {
  title: 'Interface / Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args}>{args.children}</Chip>;

export const Regular = Template.bind({});
Regular.args = {
  children: 'react',
  title: 'react',
};

export const Medium = Template.bind({});
Medium.args = {
  children: 'react',
  title: 'react',
};

export const Large = Template.bind({});
Large.args = {
  children: 'react',
  title: 'react',
  size: 'large',
};
