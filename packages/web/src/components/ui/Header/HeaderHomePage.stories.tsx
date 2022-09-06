import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Header from './Header';

export default {
  title: 'Interface / Header Homepage',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    variant: {
      options: ['homepage', 'default'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Header>;

export const HomePage: ComponentStory<typeof Header> = () => <Header variant='homepage' />;
