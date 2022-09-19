import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CardPopular from './CardPopular';

export default {
  title: 'Interface / Card',
  component: CardPopular,
} as ComponentMeta<typeof CardPopular>;

const Template: ComponentStory<typeof CardPopular> = (args) => <CardPopular {...args} />;

export const PopularPackages = Template.bind({});
PopularPackages.args = {
  id: '1EkL1u5g',
  title: '@team-griffin/react-heading-section',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  imagesList: [
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  ],
  numberOfUses: 5265,
};
