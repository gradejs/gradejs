import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import SearchResults from './SearchResults';

export default {
  title: 'Layouts / Search Results',
  component: SearchResults,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SearchResults>;

const Template: ComponentStory<typeof SearchResults> = (args) => <SearchResults {...args} />;

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
  pageLoading: true,
};
