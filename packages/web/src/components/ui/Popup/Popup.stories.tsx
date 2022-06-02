import React from 'react';
import Popup, { Props } from './Popup';
import { Button } from "../index";

export default {
  title: 'Interface / Popup',
  component: Popup,
  parameters: {
    layout: 'centered',
  },
};

export const Default = (args: Props) => <Popup {...args} TriggerComponent={Button} triggerChildren='Filter'>
  <div>some content</div>
  <div>some content</div>
  <div>some content</div>
</Popup>;
Default.args = {
  children: 'Button',
};
