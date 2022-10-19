import { vulnerabilitiesData } from './PackageVersionMocks';
import { GetPackageInfoOutput } from '../services/apiClient';
import { PackageUsageByHostnameProjection, WebPageScan } from '@gradejs-public/shared';

export const loadedPackagePageData: GetPackageInfoOutput = {
  id: 123,
  name: 'hoist-non-react-statics',
  monthlyDownloads: 123,
  updateSeq: 1,
  updatedAt: new Date().toString(),
  popularity: {
    total: 1234,
    byVersion: [
      { package_version: '20.1.0', count: 234 },
      { package_version: '18.1.0', count: 432 },
    ],
  },
  usage: [
    {
      hostname: { hostname: 'tinkoff.ru' },
      sourceScan: {
        scanResult: { identifiedPackages: [1, 2, 3, 4] } as unknown as WebPageScan.Result,
      },
    } as PackageUsageByHostnameProjection,
    {
      hostname: { hostname: 'avito.ru' },
      sourceScan: {
        scanResult: { identifiedPackages: [1, 2, 3, 4, 5, 6] } as unknown as WebPageScan.Result,
      },
    } as PackageUsageByHostnameProjection,
    {
      hostname: { hostname: 'fingerprint.com' },
      sourceScan: {
        scanResult: { identifiedPackages: [1, 2, 3, 4, 5, 6] } as unknown as WebPageScan.Result,
      },
    } as PackageUsageByHostnameProjection,
    {
      hostname: { hostname: 'linux.org.ru' },
      sourceScan: {
        scanResult: { identifiedPackages: [1, 2, 3, 4, 5, 6] } as unknown as WebPageScan.Result,
      },
    } as PackageUsageByHostnameProjection,
    {
      hostname: { hostname: 'www.nooo.me' },
      sourceScan: {
        scanResult: { identifiedPackages: [1, 2, 3, 4, 5, 6] } as unknown as WebPageScan.Result,
      },
    } as PackageUsageByHostnameProjection,
    {
      hostname: { hostname: 'quintessentially.com' },
      sourceScan: {
        scanResult: { identifiedPackages: [1, 2, 3, 4, 5, 6] } as unknown as WebPageScan.Result,
      },
    } as PackageUsageByHostnameProjection,
  ],
  latestVersion: '20.1.0',
  description:
    'A JavaScript date library for parsing, validating, manipulating, and formatting dates',
  fullDescription:
    'Copies non-react specific statics from a child component to a parent component. Similar to Object.assign, but with React static keywords blacklisted from being overridden. This package uses Object.defineProperty which has a broken implementation in IE8. In order to use this package in IE8, you will need a polyfill that fixes this method.',
  versionSpecificValues: {
    '20.1.0': {
      unpackedSize: 123456,
      registryModulesCount: 12,
      dependencies: {
        art: 'art',
        'create-react-class': 'create-react-class',
        scheduler: 'scheduler',
        'loose-envify': 'loose-envify',
      },
    },
    '18.1.0': {
      unpackedSize: 123,
      registryModulesCount: 5,
      dependencies: {
        art: 'art',
        'create-react-class': 'create-react-class',
        scheduler: 'scheduler',
        'loose-envify': 'loose-envify',
      },
    },
  },
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
  maintainers: [
    {
      avatar: 'https://s.gravatar.com/avatar/27f5eb444e2d61659e9fde1485dbab97',
      name: 'ljharb',
      email: 'ljharb@test.com',
    },
    {
      avatar: 'https://s.gravatar.com/avatar/efbf22112e13bfe715f0505b36febea9',
      name: 'acdlite',
      email: 'acdlite@test.com',
    },
    {
      avatar: 'https://s.gravatar.com/avatar/6d53507494cadf3a930696364e634992',
      name: 'gaearon',
      email: 'gaearon@test.com',
    },
  ],
};
