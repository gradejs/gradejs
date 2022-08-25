import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Card from './Card';

export default {
  title: 'Interface / Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />;

export const PopularSearchQueries = Template.bind({});
PopularSearchQueries.args = {
  title: 'github.com',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  packageTags: {
    featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
    restPackages: 45,
  },
};

export const PopularPackages = Template.bind({});
PopularPackages.args = {
  title: '@team-griffin/react-heading-section',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  featuredSites: {
    iconList: [
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    ],
    numberOfUses: 5265,
  },
};

export const VulnerableSites = Template.bind({});
VulnerableSites.args = {
  title: 'disneyland.omsk.ru/signup',
  vulnerablePackage: {
    name: 'mdast-util-from-markdown',
    moreCount: 1,
  },
  variant: 'vulnerable',
};
