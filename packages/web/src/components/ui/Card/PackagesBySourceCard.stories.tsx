import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import PackagesBySourceCard from './PackagesBySourceCard';

export default {
  title: 'Interface / Card',
  component: PackagesBySourceCard,
} as ComponentMeta<typeof PackagesBySourceCard>;

const Template: ComponentStory<typeof PackagesBySourceCard> = (args) => (
  <PackagesBySourceCard {...args} />
);

export const PopularSearchQueries = Template.bind({});
PopularSearchQueries.args = {
  sourceTitle: 'github.com',
  sourceIcon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  packages: ['mdast-util-from-markdown', 'react', 'react-dom'],
  morePackagesCount: 45,
};
