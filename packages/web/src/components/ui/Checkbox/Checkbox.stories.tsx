import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Checkbox from './Checkbox';

export default {
  title: 'Interface / Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Checkbox',
};

export const Checked = Template.bind({});
Checked.args = {
  label: 'Checkbox',
  checked: true,
};
