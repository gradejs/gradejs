import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import CardVulnerable from './CardVulnerable';

export default {
  title: 'Interface / Card',
  component: CardVulnerable,
} as ComponentMeta<typeof CardVulnerable>;

const Template: ComponentStory<typeof CardVulnerable> = (args) => <CardVulnerable {...args} />;

export const VulnerableSites = Template.bind({});
VulnerableSites.args = {
  id: 'mhwO2bPM',
  title: 'disneyland.omsk.ru/signup',
  vulnerableName: 'mdast-util-from-markdown',
  vulnerableMore: 1,
};
