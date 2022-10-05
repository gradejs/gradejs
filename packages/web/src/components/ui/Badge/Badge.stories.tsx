import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Badge from './Badge';

export default {
  title: 'Interface / Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const OneDigit = Template.bind({});
OneDigit.args = {
  content: 4,
};

export const TwoDigits = Template.bind({});
TwoDigits.args = {
  content: 42,
};
