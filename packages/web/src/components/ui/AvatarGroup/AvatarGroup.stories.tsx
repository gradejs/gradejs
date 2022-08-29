import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AvatarGroup from './AvatarGroup';

export default {
  title: 'Interface / AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AvatarGroup>;

const Template: ComponentStory<typeof AvatarGroup> = (args) => <AvatarGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  avatarGroup: [
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  ],
  counter: 5265,
};
