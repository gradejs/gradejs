import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AvatarGroup from './AvatarGroup';
import Avatar from '../Avatar/Avatar';

export default {
  title: 'Interface / AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof AvatarGroup>;

export const Primary: ComponentStory<typeof AvatarGroup> = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <AvatarGroup>
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
    </AvatarGroup>
  </div>
);

export const MoreThanMax: ComponentStory<typeof AvatarGroup> = () => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <AvatarGroup max={4}>
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
      <Avatar src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' />
    </AvatarGroup>
  </div>
);
