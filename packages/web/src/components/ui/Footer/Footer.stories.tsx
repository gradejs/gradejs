import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Footer from './Footer';

export default {
  title: 'Interface / Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Main = Template.bind({});
Main.args = {
  centerLinks: [
    { to: '/about', name: 'About' },
    { to: '/community', name: 'Community' },
    { to: '/github', name: 'GitHub' },
  ],
  rightLinks: [
    { to: '/popular', name: 'Popular packages' },
    { to: '/search', name: 'Go to search' },
  ],
};
