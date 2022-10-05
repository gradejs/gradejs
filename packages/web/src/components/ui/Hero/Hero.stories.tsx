import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Hero from './Hero';

export default {
  title: 'Interface / Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Hero>;

const Template: ComponentStory<typeof Hero> = (args) => <Hero {...args} />;

export const Main = Template.bind({});
Main.args = {
  suggestions: ['tinkoff.ru', 'pinterest.com', 'github.com', 'gradejs.com', 'npmjs.com'],
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  suggestions: ['tinkoff.ru', 'pinterest.com', 'github.com', 'gradejs.com', 'npmjs.com'],
};
