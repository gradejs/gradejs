import React from 'react';
import Loading from './Loading';

export default {
  title: 'Layouts / Loading',
  component: Loading,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => <Loading />;
