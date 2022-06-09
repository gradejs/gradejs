import React from 'react';
import Radio, { Props } from './Radio';

export default {
  title: 'Interface / Radio button',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
};

export const Default = (args: Props) => (
  <>
    <div>
      <Radio {...args} name='test' value='1'>
        First <i>element</i>
      </Radio>
    </div>
    <div>
      <Radio {...args} name='test' value='2'>
        Second <b>element</b>
      </Radio>
    </div>
    <div>
      <Radio {...args} name='test' value='3'>
        Third <u>element</u>
      </Radio>
    </div>
  </>
);
Default.args = {};
