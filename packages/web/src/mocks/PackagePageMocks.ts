import { usedOnSitesData } from './SitesListMocks';
import { entriesData, modulesData, vulnerabilitiesData } from './PackageVersionMocks';

const individualPackageVersionOneData = {
  version: '18.2.0',
  updateDate: '2 month ago',
  uses: 23987,
  size: 160,
  sizeUnit: 'Byte',
  sizeUnitShorthand: 'B',
  modulesCount: 50,
  modules: modulesData,
  entries: entriesData,
};

const individualPackageVersionTwoData = {
  version: '18.1.0',
  updateDate: '3 month ago',
  uses: 23987,
  size: 160,
  sizeUnit: 'Byte',
  sizeUnitShorthand: 'B',
  modulesCount: 50,
  modules: modulesData,
  entries: entriesData,
};

export const loadedPackagePageData = {
  currentVersion: '20.1.0',
  lastUpdate: '3 month ago',
  shortDesc:
    'A JavaScript date library for parsing, validating, manipulating, and formatting dates',
  desc: 'Copies non-react specific statics from a child component to a parent component. Similar to Object.assign, but with React static keywords blacklisted from being overridden.',
  fullDesc:
    'Copies non-react specific statics from a child component to a parent component. Similar to Object.assign, but with React static keywords blacklisted from being overridden. This package uses Object.defineProperty which has a broken implementation in IE8. In order to use this package in IE8, you will need a polyfill that fixes this method.',
  usedOnList: usedOnSitesData,
  delta: 4,
  dependencies: ['art', 'create-react-class', 'scheduler', 'loose-envify'],
  dependents: [
    'ant-design-draggable-modal-4',
    'aesthetic-react',
    'samanage-redux-form',
    'hoist-non-react-statics-es',
    'react-reformed',
    'yo-router',
    '@canner/page-wrapper',
    'react-falcor',
  ],
  keywords: [
    '#moment',
    '#date',
    '#format',
    '#time',
    '#validate',
    '#parse',
    '#ender',
    '#i18n',
    '#l10n',
  ],
  homepageUrl: 'https://github.com/mridgway/hoist-non-react-statics',
  repositoryUrl: 'https://github.com/mridgway/hoist-non-react-statics',
  vulnerabilities: vulnerabilitiesData,
  versions: [individualPackageVersionOneData, individualPackageVersionTwoData],
  maintainers: [
    {
      avatar: 'https://s.gravatar.com/avatar/27f5eb444e2d61659e9fde1485dbab97',
      name: 'ljharb',
    },
    {
      avatar: 'https://s.gravatar.com/avatar/efbf22112e13bfe715f0505b36febea9',
      name: 'acdlite',
    },
    {
      avatar: 'https://s.gravatar.com/avatar/6d53507494cadf3a930696364e634992',
      name: 'gaearon',
    },
  ],
};
