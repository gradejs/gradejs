import semver from 'semver';
import memoize from 'lodash.memoize';
import { createSelector } from '@reduxjs/toolkit';
import {
  GithubAdvisorySeverity,
  WebPagePackage,
  PackageVulnerabilityData,
} from '@gradejs-public/shared';
import { RootState } from '../';
import { FiltersState } from '../../components/layouts/Filters/Filters';
import { SeverityWeightMap } from '../../components/ui/Vulnerability/Vulnerability';

const getPackages = (state: RootState) => state.webpageResults.detectionResult.packages;
const getWebpages = (state: RootState) => state.webpageResults.detectionResult.webpages;
const getVulnerabilities = (state: RootState) =>
  state.webpageResults.detectionResult.vulnerabilities;
const getSorting = (state: RootState) => state.webpageResults.filters.sort;
const getFilter = (state: RootState) => state.webpageResults.filters.filter;
const getPackageNameFilter = (state: RootState) => state.webpageResults.filters.filterPackageName;

const compareByPopularity = (left: WebPagePackage, right: WebPagePackage) =>
  (right.registryMetadata?.monthlyDownloads ?? 0) - (left.registryMetadata?.monthlyDownloads ?? 0);

const pickHighestSeverity = memoize(
  (packageName: string, vulnerabilities: Record<string, PackageVulnerabilityData[]>) =>
    (vulnerabilities[packageName] ?? [])
      .map((it) => it.severity)
      .filter((it): it is GithubAdvisorySeverity => !!it)
      .reduce(
        (acc, val) => (val && SeverityWeightMap[acc] > SeverityWeightMap[val] ? acc : val),
        'UNKNOWN'
      )
);

const sortingModes: Record<
  FiltersState['sort'],
  (
    packages: WebPagePackage[],
    vulnerabilities: Record<string, PackageVulnerabilityData[]>
  ) => WebPagePackage[]
> = {
  // TODO
  confidenceScore: (packages) => packages,
  // TODO
  importDepth: (packages) => packages,
  severity: (packages, vulnerabilities) =>
    [...packages].sort((left, right) => {
      const leftSeverity = pickHighestSeverity(left.packageName, vulnerabilities);
      const rightSeverity = pickHighestSeverity(right.packageName, vulnerabilities);

      if (leftSeverity !== rightSeverity) {
        return SeverityWeightMap[rightSeverity] - SeverityWeightMap[leftSeverity];
      }

      return compareByPopularity(left, right);
    }),
  size: (packages) =>
    [...packages].sort(
      (left, right) =>
        (right.packageMetadata?.approximateByteSize ?? 0) -
        (left.packageMetadata?.approximateByteSize ?? 0)
    ),
  name: (packages) =>
    [...packages].sort((left, right) => left.packageName.localeCompare(right.packageName)),
  packagePopularity: (packages) => [...packages].sort(compareByPopularity),
};

const filterModes: Record<
  FiltersState['filter'],
  (
    packages: WebPagePackage[],
    vulnerabilities: Record<string, PackageVulnerabilityData[]>,
    packageName?: string
  ) => WebPagePackage[]
> = {
  name: (packages, vulnerabilities, packageName) => {
    if (!packageName) {
      return packages;
    }
    return packages.filter((pkg) => pkg.packageName.includes(packageName));
  },
  outdated: (packages) =>
    packages.filter(
      (pkg) =>
        pkg.registryMetadata &&
        semver.gtr(pkg.registryMetadata.latestVersion, pkg.packageVersionRange)
    ),
  vulnerable: (packages, vulnerabilities) =>
    packages.filter((pkg) => !!vulnerabilities[pkg.packageName]),
  all: (packages) => packages,
};

export const selectors = {
  default: createSelector([getWebpages, getVulnerabilities], (webpages, vulnerabilities) => ({
    webpages,
    vulnerabilities,
  })),
  isLoading: (state: RootState) => state.webpageResults.isLoading,
  isPending: createSelector(
    [getWebpages],
    (webpages) => webpages.length === 0 || webpages.some((item) => item.status === 'pending')
  ),
  isProtected: createSelector([getWebpages], (webpages) =>
    webpages.some((item) => item.status === 'protected')
  ),
  isFailed: (state: RootState) => state.webpageResults.isFailed,
  isInvalid: createSelector(
    [getWebpages, getPackages],
    (webpages, packages) =>
      packages.length === 0 &&
      webpages.length > 0 &&
      webpages.some((item) => item.status === 'pending')
  ),
  packagesSortedAndFiltered: createSelector(
    [getPackages, getVulnerabilities, getSorting, getFilter, getPackageNameFilter],
    (packages, vulnerabilities, sorting, filter, packageNameFilter) =>
      filterModes[filter](
        sortingModes[sorting](packages, vulnerabilities),
        vulnerabilities,
        packageNameFilter
      )
  ),
};