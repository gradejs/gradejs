import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ScansWithVulnerabilitiesCard from './ScansWithVulnerabilitiesCard';

export default {
  title: 'Interface / Card',
  component: ScansWithVulnerabilitiesCard,
} as ComponentMeta<typeof ScansWithVulnerabilitiesCard>;

const Template: ComponentStory<typeof ScansWithVulnerabilitiesCard> = (args) => (
  <ScansWithVulnerabilitiesCard {...args} />
);

export const VulnerableSites = Template.bind({});
VulnerableSites.args = {
  sourceTitle: 'disneyland.omsk.ru/signup',
  vulnerablePackageName: 'mdast-util-from-markdown',
  additionalVulnerabilitiesCount: 1,
};
