import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import TreeMap from './TreeMap';

export default {
  title: 'Interface / TreeMap',
  component: TreeMap,
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof TreeMap>;

const Template: ComponentStory<typeof TreeMap> = (args) => (
  <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
    <TreeMap {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  modules: [
    { packageFile: '/helpers/toConsumableArray.js', approximateByteSize: 167 },
    { packageFile: '/helpers/esm/defineProperty.js', approximateByteSize: 180 },
    { packageFile: '/helpers/objectWithoutProperties.js', approximateByteSize: 332 },
    { packageFile: '/regenerator/index.js', approximateByteSize: 4723 },
    { packageFile: '/helpers/iterableToArrayLimit.js', approximateByteSize: 384 },
    { packageFile: '/helpers/esm/classCallCheck.js', approximateByteSize: 154 },
    { packageFile: '/helpers/arrayWithHoles.js', approximateByteSize: 115 },
    { packageFile: '/helpers/arrayWithoutHoles.js', approximateByteSize: 137 },
    { packageFile: '/helpers/taggedTemplateLiteral.js', approximateByteSize: 186 },
    { packageFile: '/helpers/esm/arrayLikeToArray.js', approximateByteSize: 166 },
    { packageFile: '/helpers/objectWithoutPropertiesLoose.js', approximateByteSize: 206 },
    { packageFile: '/helpers/esm/toConsumableArray.js', approximateByteSize: 373 },
    { packageFile: '/helpers/esm/slicedToArray.js', approximateByteSize: 465 },
    { packageFile: '/helpers/esm/createClass.js', approximateByteSize: 283 },
    { packageFile: '/helpers/esm/objectWithoutProperties.js', approximateByteSize: 701 },
    { packageFile: '/helpers/iterableToArray.js', approximateByteSize: 186 },
    { packageFile: '/helpers/typeof.js', approximateByteSize: 434 },
    { packageFile: '/helpers/defineProperty.js', approximateByteSize: 192 },
    { packageFile: '/helpers/esm/getPrototypeOf.js', approximateByteSize: 500 },
    { packageFile: '/helpers/unsupportedIterableToArray.js', approximateByteSize: 377 },
    { packageFile: '/helpers/slicedToArray.js', approximateByteSize: 173 },
    { packageFile: '/helpers/extends.js', approximateByteSize: 345 },
    { packageFile: '/helpers/arrayLikeToArray.js', approximateByteSize: 178 },
    { packageFile: '/helpers/esm/setPrototypeOf.js', approximateByteSize: 804 },
    { packageFile: '/helpers/esm/wrapNativeSuper.js', approximateByteSize: 3745 },
    { packageFile: '/helpers/esm/unsupportedIterableToArray.js', approximateByteSize: 1423 },
    { packageFile: '/helpers/nonIterableRest.js', approximateByteSize: 246 },
    { packageFile: '/helpers/assertThisInitialized.js', approximateByteSize: 195 },
    { packageFile: '/helpers/inheritsLoose.js', approximateByteSize: 179 },
    { packageFile: '/helpers/esm/extends.js', approximateByteSize: 89000 },
    { packageFile: '/helpers/interopRequireDefault.js', approximateByteSize: 123 },
    { packageFile: '/helpers/esm/assertThisInitialized.js', approximateByteSize: 183 },
    { packageFile: '/helpers/nonIterableSpread.js', approximateByteSize: 241 },
    { packageFile: '/helpers/setPrototypeOf.js', approximateByteSize: 230 },
  ],
};

export const OneModule = Template.bind({});
OneModule.args = {
  modules: [{ packageFile: '/index.js', approximateByteSize: 167 }],
};

export const NoModules = Template.bind({});
NoModules.args = {
  modules: [],
};
