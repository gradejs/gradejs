import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Container from '../Container/Container';
import PopularPackageCardList from './PopularPackageCardList';
import { popularPackageListData } from '../../../mocks/CardListsMocks';

export default {
  title: 'Interface / Card List',
  component: PopularPackageCardList,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PopularPackageCardList>;

const Template: ComponentStory<typeof PopularPackageCardList> = (args) => (
  <Container>
    <PopularPackageCardList {...args} />
  </Container>
);

export const PopularPackages = Template.bind({});
PopularPackages.args = {
  cards: popularPackageListData,
};
