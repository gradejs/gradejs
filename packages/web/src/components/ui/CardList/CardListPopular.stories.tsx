import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Container from '../Container/Container';
import CardListPopular from './CardListPopular';

export default {
  title: 'Interface / Card List',
  component: CardListPopular,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CardListPopular>;

const Template: ComponentStory<typeof CardListPopular> = (args) => (
  <Container>
    <CardListPopular {...args} />
  </Container>
);

export const PopularPackages = Template.bind({});
PopularPackages.args = {
  cards: [
    {
      id: 'FPsBcl8R',
      title: '@team-griffin/react-heading-section',
      description: "This package's job is to automatically determine...",
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'emtYcsUh',
      title: 'unist-util-generated',
      description: 'unist utility to check if a node is generated',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'TYIwvAfy',
      title: 'react-smooth',
      description: 'is a animation library work on React',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'Lq1pEEX7',
      title: 'unist-util-position',
      description: 'unist utility to get the positional info of nodes',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'cWOgIbmp',
      title: 'vfile-message',
      description: 'Create vfile messages',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
  ],
};
