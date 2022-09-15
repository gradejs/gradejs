import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import DefaultHeader from './DefaultHeader';

export default {
  title: 'Interface / Header Homepage',
  component: DefaultHeader,
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
} as ComponentMeta<typeof DefaultHeader>;

export const HomePage: ComponentStory<typeof DefaultHeader> = () => (
  <DefaultHeader variant='light' />
);
