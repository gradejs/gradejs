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
Default.args = {
  packagesStats: { total: 1, vulnerable: 1, outdated: 1 },
  packages: [
    {
      name: 'react',
      versionSet: ['17.0.2'],
      moduleIds: [],
      modules: [],
      approximateByteSize: 123,
      outdated: true,
      vulnerable: true,
      vulnerabilities: [],
      duplicate: false,
      version: '17.0.2',
    },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  packagesStats: { total: 0, vulnerable: 0, outdated: 0 },
  isLoading: true,
  packages: [],
};
