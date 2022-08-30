import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Header from './Header';

export default {
  title: 'Interface / Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const HomePage = Template.bind({});
