import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Container from '../Container/Container';
import PackagesBySourceCardList from './PackagesBySourceCardList';
import { packagesBySourceListData } from '../../../mocks/CardListsMocks';

export default {
  title: 'Interface / Card List',
  component: PackagesBySourceCardList,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PackagesBySourceCardList>;

const Template: ComponentStory<typeof PackagesBySourceCardList> = (args) => (
  <Container>
    <PackagesBySourceCardList {...args} />
  </Container>
);

export const PopularSearchQueries = Template.bind({});
PopularSearchQueries.args = {
  cards: packagesBySourceListData,
};
