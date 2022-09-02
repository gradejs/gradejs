import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Person from './Person';

export default {
  title: 'Interface / Person',
  component: Person,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Person>;

const Template: ComponentStory<typeof Person> = (args) => <Person {...args} />;

export const Default = Template.bind({});
Default.args = {
  image: 'https://via.placeholder.com/36',
  name: 'Lorem ipsum',
};

export const Selected = Template.bind({});
Selected.args = {
  image: 'https://via.placeholder.com/36',
  name: 'Lorem ipsum',
  checked: true,
};
