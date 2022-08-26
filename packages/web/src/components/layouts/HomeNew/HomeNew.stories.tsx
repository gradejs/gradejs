import React from 'react';
import HomeNew from './HomeNew';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Layouts / Home',
  component: HomeNew,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof HomeNew>;

const Template: ComponentStory<typeof HomeNew> = (args) => <HomeNew {...args} />;

export const New = Template.bind({});
New.args = {
  suggestions: ['tinkoff.ru', 'pinterest.com', 'github.com', 'gradejs.com', 'npmjs.com'],
};
