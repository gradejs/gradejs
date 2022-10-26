import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import VersionPopularityChart from './VersionPopularityChart';
import VersionPopularityChartSkeleton from './VersionPopularityChartSkeleton';

export default {
  title: 'Interface / Version Popularity Chart',
  component: VersionPopularityChart,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof VersionPopularityChart>;

const Template: ComponentStory<typeof VersionPopularityChart> = (args) => (
  <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
    <VersionPopularityChart {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  versionSpecificValues: {
    '1.0.0': {
      uses: 100,
    },
    '1.0.1': {
      uses: 1100,
      isVulnerable: true,
    },
    '1.0.2': {
      uses: 1400,
    },
    '1.0.3': {
      uses: 23,
    },
    '1.1.0': {
      uses: 1356,
    },
    '2.0.0': {
      uses: 3424,
    },
    '2.0.1': {
      uses: 4434,
    },
  },
};

export const WithRange = Template.bind({});
WithRange.args = {
  versionSpecificValues: {
    '1.0.0': {
      uses: 100,
    },
    '1.0.1': {
      uses: 1100,
    },
    '1.0.2': {
      uses: 1400,
    },
    '1.0.3': {
      uses: 23,
    },
    '1.1.0': {
      uses: 1356,
    },
    '2.0.0': {
      uses: 3424,
    },
    '2.0.1': {
      uses: 4434,
    },
  },
  highlightedVersionRange: '1.0.0 - 1.0.2',
};

export const WithRangeOutside = Template.bind({});
WithRangeOutside.args = {
  versionSpecificValues: {
    '1.0.0': {
      uses: 1000,
    },
    '1.0.1': {
      uses: 2000,
    },
    '1.0.2': {
      uses: 2000,
    },
    '1.0.3': {
      uses: 2000,
    },
    '1.1.0': {
      uses: 2000,
    },
    '2.0.0': {
      uses: 2000,
    },
    '2.0.1': {
      uses: 2000,
    },
  },
  highlightedVersionRange: '1.0.0',
};

export const Skeleton = () => (
  <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
    <VersionPopularityChartSkeleton />
  </div>
);
