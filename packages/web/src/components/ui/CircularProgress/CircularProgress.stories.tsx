import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import CircularProgress from './CircularProgress';

export default {
  title: 'Interface / Circular Progress',
  component: CircularProgress,
} as ComponentMeta<typeof CircularProgress>;

export const Default: ComponentStory<typeof CircularProgress> = () => (
  <CircularProgress progress={50} />
);
