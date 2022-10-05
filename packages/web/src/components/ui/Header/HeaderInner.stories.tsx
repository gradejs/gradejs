import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import DefaultHeader from './DefaultHeader';

export default {
  title: 'Interface / Header Inner page',
  component: DefaultHeader,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof DefaultHeader>;

export const InnerPage: ComponentStory<typeof DefaultHeader> = () => <DefaultHeader showSearch />;
