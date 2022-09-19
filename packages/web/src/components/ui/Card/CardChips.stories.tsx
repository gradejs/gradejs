import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CardChips from './CardChips';

export default {
  title: 'Interface / Card',
  component: CardChips,
} as ComponentMeta<typeof CardChips>;

const Template: ComponentStory<typeof CardChips> = (args) => <CardChips {...args} />;

export const PopularSearchQueries = Template.bind({});
PopularSearchQueries.args = {
  id: 'uExBVGuF',
  title: 'github.com',
  icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  chips: ['mdast-util-from-markdown', 'react', 'react-dom'],
  restPackages: 45,
};
