import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import PackagePage from './PackagePage';
import { loadedPackagePageData } from 'mocks/PackagePageMocks';

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
  packageInfo: loadedPackagePageData,
};

export const Loading = Template.bind({});
Loading.args = {
  packageInfo: loadedPackagePageData,
  loading: true,
};
