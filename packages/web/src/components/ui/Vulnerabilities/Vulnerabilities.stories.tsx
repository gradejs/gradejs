import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Vulnerabilities from './Vulnerabilities';
import { GithubAdvisorySeverity } from '../../../../../shared/src';

export default {
  title: 'Interface / Vulnerabilities',
  component: Vulnerabilities,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof Vulnerabilities>;

const Template: ComponentStory<typeof Vulnerabilities> = (args) => <Vulnerabilities {...args} />;

export const Default = Template.bind({});
Default.args = {
  vulnerabilities: [
    {
      affectedPackageName: 'nth-check',
      affectedVersionRange: '>=0 <2.0.1',
      detailsUrl: 'https://github.com/advisories/GHSA-rp65-9cf3-cjxr',
      osvId: 'GHSA-rp65-9cf3-cjxr',
      severity: GithubAdvisorySeverity.High,
      summary: 'Inefficient Regular Expression Complexity in nth-check',
    },
    {
      affectedPackageName: 'nth-check',
      affectedVersionRange: '>=0 <2.0.1',
      detailsUrl: 'https://github.com/advisories/GHSA-rp65-9cf3-cjxr',
      osvId: 'GHSA-rp65-9cf3-cjxr-duplicate',
      severity: GithubAdvisorySeverity.High,
      summary: 'Inefficient Regular Expression Complexity in nth-check',
    },
  ],
};
