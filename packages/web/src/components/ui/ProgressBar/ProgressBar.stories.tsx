import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ProgressBar from './ProgressBar';

export default {
  title: 'Interface / Progress Bar',
  component: ProgressBar,
} as ComponentMeta<typeof ProgressBar>;

export const Default: ComponentStory<typeof ProgressBar> = () => <ProgressBar progress={50} />;
