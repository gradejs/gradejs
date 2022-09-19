import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Container from '../Container/Container';
import CardListChips from './CardListChips';

export default {
  title: 'Interface / Card List',
  component: CardListChips,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CardListChips>;

const Template: ComponentStory<typeof CardListChips> = (args) => (
  <Container>
    <CardListChips {...args} />
  </Container>
);

export const PopularSearchQueries = Template.bind({});
PopularSearchQueries.args = {
  cards: [
    {
      id: 'uExBVGuF',
      title: 'github.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      chips: ['mdast-util-from-markdown', 'react', 'react-dom'],
      restPackages: 45,
    },
    {
      id: '1EkL1u5g',
      title: 'fingerprint.com',
      icon: 'https://avatars.githubusercontent.com/u/67208791?s=200&v=4',
      chips: ['mdast-util-from-markdown', 'react', 'react-dom'],
      restPackages: 45,
    },
    {
      id: 'mhwO2bPM',
      title: 'facebook.com',
      icon: 'https://avatars.githubusercontent.com/u/69631?s=200&v=4',
      chips: ['react'],
      restPackages: 45,
    },
  ],
};
