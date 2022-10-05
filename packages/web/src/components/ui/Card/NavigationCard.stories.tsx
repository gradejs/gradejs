import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import NavigationCard from './NavigationCard';

export default {
  title: 'Interface / Card',
  component: NavigationCard,
} as ComponentMeta<typeof NavigationCard>;

const Template: ComponentStory<typeof NavigationCard> = (args) => <NavigationCard {...args} />;

export const Navigation = Template.bind({});
Navigation.args = {
  title: 'Go to all Popular packages',
  to: '/',
};
