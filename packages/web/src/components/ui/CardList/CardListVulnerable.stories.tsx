import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Container from '../Container/Container';
import CardListVulnerable from './CardListVulnerable';

export default {
  title: 'Interface / Card List',
  component: CardListVulnerable,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CardListVulnerable>;

const Template: ComponentStory<typeof CardListVulnerable> = (args) => (
  <Container>
    <CardListVulnerable {...args} />
  </Container>
);

export const VulnerableSites = Template.bind({});
VulnerableSites.args = {
  cards: [
    {
      id: 'LnO9Xynn',
      title: 'disneyland.omsk.ru/signup',
      vulnerableName: 'mdast-util-from-markdown',
    },
    {
      id: '-A74UAy8',
      title: 'disneyland.omsk.ru/signup',
      vulnerableName: 'mdast-util-from-markdown',
      vulnerableMore: 1,
    },
    {
      id: 'DPa05I2W',
      title: 'disneyland.omsk.ru/signup',
      vulnerableName: 'mdast-util-from-markdown',
    },
  ],
};
