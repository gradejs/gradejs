import React from 'react';
import Dropdown from './Dropdown';

export default {
  title: 'Interface / Dropdown',
  component: Dropdown,
};

export const Default = () => (
  <Dropdown>
    <div>some content</div>
    <div>some content</div>
    <div>some content</div>
  </Dropdown>
);
Default.args = {
  children: 'Dropdown',
};
