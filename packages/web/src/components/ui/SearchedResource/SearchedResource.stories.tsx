import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SearchedResource from './SearchedResource';

export default {
  title: 'Interface / SearchedResource',
  component: SearchedResource,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof SearchedResource>;

const Template: ComponentStory<typeof SearchedResource> = (args) => <SearchedResource {...args} />;

export const Default = Template.bind({});
Default.args = {
  image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  name: 'example.com',
  totalPackages: 42,
  lastScanDate: '21 feb in 21:30',
};
