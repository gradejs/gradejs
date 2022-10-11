import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import PopularPackages from './PopularPackages';

export default {
  title: 'Layouts / Most Popular Packages',
  component: PopularPackages,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PopularPackages>;

const Template: ComponentStory<typeof PopularPackages> = () => <PopularPackages />;

export const Default = Template.bind({});
Default.args = {};
