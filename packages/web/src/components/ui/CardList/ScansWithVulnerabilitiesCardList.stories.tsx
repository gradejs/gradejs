import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Container from '../Container/Container';
import ScansWithVulnerabilitiesCardList from './ScansWithVulnerabilitiesCardList';
import { scansWithVulnerabilitiesListData } from '../../../mocks/CardListsMocks';

export default {
  title: 'Interface / Card List',
  component: ScansWithVulnerabilitiesCardList,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ScansWithVulnerabilitiesCardList>;

const Template: ComponentStory<typeof ScansWithVulnerabilitiesCardList> = (args) => (
  <Container>
    <ScansWithVulnerabilitiesCardList {...args} />
  </Container>
);

export const VulnerableSites = Template.bind({});
VulnerableSites.args = {
  cards: scansWithVulnerabilitiesListData,
};
