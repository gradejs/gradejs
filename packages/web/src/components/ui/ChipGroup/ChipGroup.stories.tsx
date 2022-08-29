import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ChipGroup from './ChipGroup';
import styles from '../Card/Card.module.scss';
import Chip from '../Chip/Chip';

export default {
  title: 'Interface / ChipGroup',
  component: ChipGroup,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ChipGroup>;

const Template: ComponentStory<typeof ChipGroup> = (args) => <ChipGroup {...args} />;

export const Default = Template.bind({});
Default.args = {
  chips: ['mdast-util-from-markdown', 'react', 'react-dom'],
};

export const WithMoreCounter = Template.bind({});
const MoreCounter = (
  <Chip className={styles.tag} variant='outlined' size='large'>
    +45 packages
  </Chip>
);
WithMoreCounter.args = {
  chips: ['mdast-util-from-markdown', 'react', 'react-dom'],
  children: MoreCounter,
};
