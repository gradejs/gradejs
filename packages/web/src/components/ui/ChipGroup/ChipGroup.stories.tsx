import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ChipGroup from './ChipGroup';
import Chip from '../Chip/Chip';

export default {
  title: 'Interface / ChipGroup',
  component: ChipGroup,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ChipGroup>;

export const Default: ComponentStory<typeof ChipGroup> = () => (
  <ChipGroup>
    {['mdast-util-from-markdown', 'react', 'react-dom'].map((chip) => (
      <Chip key={chip}>{chip}</Chip>
    ))}
  </ChipGroup>
);

export const Medium: ComponentStory<typeof ChipGroup> = () => (
  <ChipGroup>
    {['mdast-util-from-markdown', 'react', 'react-dom'].map((chip) => (
      <Chip key={chip} size='medium' font='monospace'>
        {chip}
      </Chip>
    ))}
  </ChipGroup>
);

export const Large: ComponentStory<typeof ChipGroup> = () => (
  <ChipGroup>
    {['mdast-util-from-markdown', 'react', 'react-dom'].map((chip) => (
      <Chip key={chip} size='large' font='monospace'>
        {chip}
      </Chip>
    ))}
  </ChipGroup>
);
