import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SearchBar from './SearchBar';

export default {
  title: 'Interface / SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => <SearchBar {...args} />;

export const Empty = Template.bind({});
Empty.args = {};

export const WithValue = Template.bind({});
WithValue.args = {
  value: 'https://reactjs.org',
};
