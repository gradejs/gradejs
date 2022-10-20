import { KeyedPackagesBySourceCardProps } from '../components/ui/CardList/PackagesBySourceCardList';
import { KeyedPopularPackageCardProps } from '../components/ui/CardList/PopularPackageCardList';
import { KeyedScansWithVulnerabilitiesCardProps } from '../components/ui/CardList/ScansWithVulnerabilitiesCardList';

export const packagesBySourceListData: KeyedPackagesBySourceCardProps[] = [
  {
    id: 'uExBVGuF',
    sourceTitle: 'github.com',
    sourceIcon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    packages: ['mdast-util-from-markdown', 'react', 'react-dom'],
    morePackagesCount: 45,
  },
  {
    id: '1EkL1u5g',
    sourceTitle: 'fingerprint.com',
    sourceIcon: 'https://avatars.githubusercontent.com/u/67208791?s=200&v=4',
    packages: ['mdast-util-from-markdown', 'react', 'react-dom'],
    morePackagesCount: 45,
  },
  {
    id: 'mhwO2bPM',
    sourceTitle: 'facebook.com',
    sourceIcon: 'https://avatars.githubusercontent.com/u/69631?s=200&v=4',
    packages: ['react'],
    morePackagesCount: 45,
  },
];

export const popularPackageListData: KeyedPopularPackageCardProps[] = [
  {
    id: 'FPsBcl8R',
    packageName: '@team-griffin/react-heading-section',
    packageDescription: "This package's job is to automatically determine...",
    hostsFaviconList: [
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    ],
    totalUsageCount: 5265,
  },
  {
    id: 'emtYcsUh',
    packageName: '@team-griffin/react-heading-section',
    packageDescription: "This package's job is to automatically determine...",
    hostsFaviconList: [
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    ],
    totalUsageCount: 5265,
  },
  {
    id: 'TYIwvAfy',
    packageName: '@team-griffin/react-heading-section',
    packageDescription: "This package's job is to automatically determine...",
    hostsFaviconList: [
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    ],
    totalUsageCount: 5265,
  },
  {
    id: 'Lq1pEEX7',
    packageName: '@team-griffin/react-heading-section',
    packageDescription: "This package's job is to automatically determine...",
    hostsFaviconList: [
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    ],
    totalUsageCount: 5265,
  },
  {
    id: 'cWOgIbmp',
    packageName: '@team-griffin/react-heading-section',
    packageDescription: "This package's job is to automatically determine...",
    hostsFaviconList: [
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
    ],
    totalUsageCount: 5265,
  },
];

export const scansWithVulnerabilitiesListData: KeyedScansWithVulnerabilitiesCardProps[] = [
  {
    id: 'LnO9Xynn',
    sourceTitle: 'debank.com/profile/0x6f923e527a9ac0fca4e4a14ee10778fbf0d8013c',
    sourceUrl: 'disneyland.omsk.ru/signup',
    vulnerablePackageName: 'mdast-util-from-markdown',
  },
  {
    id: '-A74UAy8',
    sourceTitle: 'disneyland.omsk.ru/signup',
    sourceUrl: 'disneyland.omsk.ru/signup',
    vulnerablePackageName: 'mdast-util-from-markdown',
    additionalVulnerabilitiesCount: 1,
  },
  {
    id: 'DPa05I2W',
    sourceTitle: 'disneyland.omsk.ru/signup',
    sourceUrl: 'disneyland.omsk.ru/signup',
    vulnerablePackageName: 'mdast-util-from-markdown',
  },
];
