import semver from 'semver';
import memoize from 'lodash.memoize';
import { createSelector } from '@reduxjs/toolkit';
import { GithubAdvisorySeverity } from '@gradejs-public/shared';
import { RootState } from '../';
import { FiltersState } from '../../components/layouts/Filters/Filters';
import { SeverityWeightMap } from '../../components/ui/Vulnerability/Vulnerability';
import type { ClientApi } from '../../services/apiClient';

const getFlags = (state: RootState) => ({
  isLoading: state.webpageResults.isLoading,
  isFailed: state.webpageResults.isFailed,
});
const getScanStatus = (state: RootState) => state.webpageResults.detectionResult?.status;
const getPackages = (state: RootState) =>
  state.webpageResults.detectionResult?.scanResult?.packages;
const getVulnerabilities = (state: RootState) =>
  state.webpageResults.detectionResult?.scanResult?.vulnerabilities;
const getSorting = (state: RootState) => state.webpageResults.filters.sort;
const getFilter = (state: RootState) => state.webpageResults.filters.filter;
const getPackageNameFilter = (state: RootState) => state.webpageResults.filters.filterPackageName;

const compareByPopularity = (
  left: ClientApi.ScanResultPackageResponse,
  right: ClientApi.ScanResultPackageResponse
) =>
  (right.registryMetadata?.monthlyDownloads ?? 0) - (left.registryMetadata?.monthlyDownloads ?? 0);

const pickHighestSeverity = memoize(
  (
    packageName: string,
    vulnerabilities: Record<string, ClientApi.PackageVulnerabilityResponse[]>
  ) =>
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
    packages: ClientApi.ScanResultPackageResponse[],
    vulnerabilities: Record<string, ClientApi.PackageVulnerabilityResponse[]>
  ) => ClientApi.ScanResultPackageResponse[]
> = {
  // TODO
  confidenceScore: (packages) => packages,
  // TODO
  importDepth: (packages) => packages,
  severity: (packages, vulnerabilities) =>
    [...packages].sort((left, right) => {
      const leftSeverity = pickHighestSeverity(left.name, vulnerabilities);
      const rightSeverity = pickHighestSeverity(right.name, vulnerabilities);

      if (leftSeverity !== rightSeverity) {
        return SeverityWeightMap[rightSeverity] - SeverityWeightMap[leftSeverity];
      }

      return compareByPopularity(left, right);
    }),
  size: (packages) =>
    [...packages].sort(
      (left, right) => (right.approximateByteSize ?? 0) - (left.approximateByteSize ?? 0)
    ),
  name: (packages) => [...packages].sort((left, right) => left.name.localeCompare(right.name)),
  packagePopularity: (packages) => [...packages].sort(compareByPopularity),
};

const filterModes: Record<
  FiltersState['filter'],
  (
    packages: ClientApi.ScanResultPackageResponse[],
    vulnerabilities: Record<string, ClientApi.PackageVulnerabilityResponse[]>,
    packageName?: string
  ) => ClientApi.ScanResultPackageResponse[]
> = {
  name: (packages, vulnerabilities, packageName) => {
    if (!packageName) {
      return packages;
    }
    return packages.filter((pkg) => pkg.name.includes(packageName));
  },
  outdated: (packages) =>
    packages.filter(
      (pkg) =>
        pkg.registryMetadata && semver.gtr(pkg.registryMetadata.latestVersion, pkg.versionRange)
    ),
  vulnerable: (packages, vulnerabilities) => packages.filter((pkg) => !!vulnerabilities[pkg.name]),
  all: (packages) => packages,
};

export const selectors = {
  default: createSelector([getScanStatus, getVulnerabilities], (scanStatus, vulnerabilities) => ({
    status: scanStatus,
    vulnerabilities,
  })),
  stateFlags: createSelector(
    [getScanStatus, getPackages, getFlags],
    (scanStatus, packages, flags) => ({
      ...flags,
      isInvalid: packages && packages.length === 0,
      isPending: !scanStatus || scanStatus === 'pending',
      isProtected: scanStatus === 'protected',
    })
  ),
  packagesStats: createSelector([getPackages, getVulnerabilities], (packages = [], vulnerabilities = {}) => ({
    total: packages.length,
    vulnerable: packages.filter((pkg) => (vulnerabilities[pkg.name]?.length ?? 0) > 0)
      .length,
    outdated: packages.filter(
      (pkg) =>
        pkg.registryMetadata &&
        semver.gtr(pkg.registryMetadata.latestVersion, pkg.versionRange)
    ).length,
  })),
  packagesSortedAndFiltered: createSelector(
    [getPackages, getVulnerabilities, getSorting, getFilter, getPackageNameFilter],
    (packages, vulnerabilities, sorting, filter, packageNameFilter) =>
      packages &&
      vulnerabilities &&
      filterModes[filter](
        sortingModes[sorting](packages, vulnerabilities),
        vulnerabilities,
        packageNameFilter
      )
  ),
};
