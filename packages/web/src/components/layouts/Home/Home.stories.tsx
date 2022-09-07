import React from 'react';
import Home from './Home';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Layouts / Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Home>;

const Template: ComponentStory<typeof Home> = (args) => <Home {...args} />;

export const Default = Template.bind({});
Default.args = {
  suggestions: ['tinkoff.ru', 'pinterest.com', 'github.com', 'gradejs.com', 'npmjs.com'],
};
