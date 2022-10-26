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
      hostname: 'pinterest123.com',
      hostnamePackagesCount: 151,
    },
    {
      hostname: 'pinterest.com',
      hostnamePackagesCount: 151,
    },
    {
      hostname: 'pinterest12.com',
      hostnamePackagesCount: 151,
    },
    {
      hostname: 'pinterest1.com',
      hostnamePackagesCount: 151,
    },
    {
      hostname: 'pinterest1234.com',
      hostnamePackagesCount: 151,
    },
    {
      hostname: 'pinterest1234456.com',
      hostnamePackagesCount: 151,
    },
    {
      hostname: 'pinterest12345.com',
      hostnamePackagesCount: 151,
    },
  ],
};
