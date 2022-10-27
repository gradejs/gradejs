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
    {['@reflectivechimp/gatsby-remark-normalize-paths', 'react', 'react-dom'].map((chip) => (
      <Chip key={chip} title={chip}>
        {chip}
      </Chip>
    ))}
  </ChipGroup>
);

export const Medium: ComponentStory<typeof ChipGroup> = () => (
  <ChipGroup>
    {['@reflectivechimp/gatsby-remark-normalize-paths', 'react', 'react-dom'].map((chip) => (
      <Chip key={chip} title={chip} font='monospace'>
        {chip}
      </Chip>
    ))}
  </ChipGroup>
);

export const Large: ComponentStory<typeof ChipGroup> = () => (
  <ChipGroup>
    {['@reflectivechimp/gatsby-remark-normalize-paths', 'react', 'react-dom'].map((chip) => (
      <Chip key={chip} title={chip} size='large' font='monospace'>
        {chip}
      </Chip>
    ))}
  </ChipGroup>
);
