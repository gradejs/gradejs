import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SitesList from './SitesList';
import Container from '../Container/Container';

export default {
  title: 'Interface / SitesList',
  component: SitesList,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SitesList>;

const Template: ComponentStory<typeof SitesList> = (args) => (
  <Container>
    <SitesList {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  sites: [
    {
      id: '123',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '456',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '789',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '1231',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '12321',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '123123',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '12123132',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
  ],
};
