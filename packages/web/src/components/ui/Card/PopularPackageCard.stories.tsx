import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import PopularPackageCard from './PopularPackageCard';

export default {
  title: 'Interface / Card',
  component: PopularPackageCard,
} as ComponentMeta<typeof PopularPackageCard>;

const Template: ComponentStory<typeof PopularPackageCard> = (args) => (
  <PopularPackageCard {...args} />
);

export const PopularPackages = Template.bind({});
PopularPackages.args = {
  packageName: '@team-griffin/react-heading-section',
  packageDescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  hostsFaviconList: [
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  ],
  totalUsageCount: 5265,
};
