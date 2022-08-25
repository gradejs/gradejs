import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Container from '../Container/Container';
import CardList from './CardList';

export default {
  title: 'Interface / Card List',
  component: CardList,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CardList>;

const Template: ComponentStory<typeof CardList> = (args) => (
  <Container>
    <CardList {...args} />
  </Container>
);

export const PopularSearchQueries = Template.bind({});
PopularSearchQueries.args = {
  cards: [
    {
      title: 'github.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      title: 'fingerprint.com',
      icon: 'https://avatars.githubusercontent.com/u/67208791?s=200&v=4',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      title: 'facebook.com',
      icon: 'https://avatars.githubusercontent.com/u/69631?s=200&v=4',
      packageTags: {
        featuredPackages: ['react'],
        restPackages: 45,
      },
    },
  ],
};

export const PopularPackages = Template.bind({});
PopularPackages.args = {
  cards: [
    {
      title: '@team-griffin/react-heading-section',
      description: "This package's job is to automatically determine...",
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      title: 'unist-util-generated',
      description: 'unist utility to check if a node is generated',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      title: 'react-smooth',
      description: 'is a animation library work on React',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      title: 'unist-util-position',
      description: 'unist utility to get the positional info of nodes',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      title: 'vfile-message',
      description: 'Create vfile messages',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      title: 'Go to all Popular packages',
      variant: 'toAll',
    },
  ],
};

export const VulnerableSites = Template.bind({});
VulnerableSites.args = {
  variant: 'vertical',
  cards: [
    {
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
      },
      variant: 'vulnerable',
    },
    {
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
        moreCount: 1,
      },
      variant: 'vulnerable',
    },
    {
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
      },
      variant: 'vulnerable',
    },
  ],
};
