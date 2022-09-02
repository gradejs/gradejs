import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Header from './Header';
import SearchBar from '../SearchBar/SearchBar';

export default {
  title: 'Interface / Header Inner page',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Header>;

export const InnerPage: ComponentStory<typeof Header> = () => (
  <Header>
    <SearchBar value='pinterest.com/blog/%D0%92%D092%D092%D092%/dFD092fg092%D092%/dFD092/blog/%D0%92%D092%D092%D092%/dFD092fg092%D092%/dFD092f' />
  </Header>
);
