import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import PackagePage from './PackagePage';

export default {
  title: 'Layouts / Package Page',
  component: PackagePage,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PackagePage>;

const Template: ComponentStory<typeof PackagePage> = (args) => <PackagePage {...args} />;

export const Default = Template.bind({});
Default.args = {
  packageName: 'hoist-non-react-statics',
};

export const Loading = Template.bind({});
Loading.args = {
  packageName: 'hoist-non-react-statics',
  pageLoading: true,
};
