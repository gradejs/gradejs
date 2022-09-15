import semver from 'semver';
import memoize from 'lodash.memoize';
import { createSelector } from '@reduxjs/toolkit';
//import { GithubAdvisorySeverity } from '@gradejs-public/shared';
import { RootState } from '../';
//import { FiltersState } from '../../components/layouts/Filters/Filters';
//import { SeverityWeightMap } from '../../components/ui/Vulnerability/Vulnerability';
import type { ClientApi, GetWebPageScanOutput } from '../../services/apiClient';

export type IdentifiedPackage = ClientApi.ScanResultPackageResponse & {
  approximateByteSize?: number;
  outdated?: boolean;
  vulnerable?: boolean;
  duplicate?: boolean;
};

const getFlags = (state: RootState) => ({
  isLoading: state.webpageResults.isLoading,
  isFailed: state.webpageResults.isFailed,
});

const getScanStatus = (state: RootState) => state.webpageResults.detectionResult?.status;
export type ScanStatus = ReturnType<typeof getScanStatus>;

const getPackagesMemoized = memoize((result: GetWebPageScanOutput['scanResult']) => {
  const packages: IdentifiedPackage[] = result?.identifiedPackages ?? [];

  for (const pkg of packages) {
    pkg.approximateByteSize = pkg.moduleIds.reduce((acc: number, id) => {
      const size: number = result?.identifiedModuleMap?.[id]?.approximateByteSize ?? 0;
      return acc + size;
    }, 0);
    pkg.duplicate = false; // TODO
    pkg.outdated = !!(
      pkg.registryMetadata &&
      !pkg.versionSet.some(
        (ver) => pkg.registryMetadata && semver.eq(pkg.registryMetadata.latestVersion, ver)
      )
    );
    pkg.vulnerable = (result?.vulnerabilities[pkg.name]?.length ?? 0) > 0;
  }
  return packages;
});

const getPackages = (state: RootState) =>
  getPackagesMemoized(state.webpageResults.detectionResult?.scanResult);

const getVulnerabilities = (state: RootState) =>
  state.webpageResults.detectionResult?.scanResult?.vulnerabilities;

const getSorting = (state: RootState) => state.webpageResults.filters.sort;

const getFilter = (state: RootState) => state.webpageResults.filters.filter;

const getKeywords = (state: RootState) => [
  ...new Set(
    state.webpageResults.detectionResult?.scanResult?.identifiedPackages.reduce((acc, pkg) => {
      return acc.concat(pkg.registryMetadata?.keywords ?? []);
    }, [] as string[])
  ),
];

/*
const compareByPopularity = (left: IdentifiedPackage, right: IdentifiedPackage) =>
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
    packages: IdentifiedPackage[],
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
  (packages: IdentifiedPackage[], packageName?: string) => IdentifiedPackage[]
> = {
  outdated: (packages) => packages.filter((pkg) => !!pkg.outdated),
  vulnerable: (packages) => packages.filter((pkg) => !!pkg.vulnerable),
  all: (packages) => packages,
};*/

export const selectors = {
  default: createSelector(
    [getScanStatus, getVulnerabilities, getKeywords],
    (status, vulnerabilities, keywordsList) => ({
      status,
      vulnerabilities,
      keywordsList,
    })
  ),
  stateFlags: createSelector(
    [getScanStatus, getPackages, getFlags],
    (scanStatus, packages, flags) => ({
      ...flags,
      isInvalid: packages && packages.length === 0,
      isPending: !scanStatus || scanStatus === 'pending',
      isProtected: scanStatus === 'protected',
    })
  ),
  packagesStats: createSelector([getPackages], (packages = []) => ({
    total: packages.length,
    vulnerable: packages.filter((pkg) => !!pkg.vulnerable).length,
    outdated: packages.filter((pkg) => !!pkg.outdated).length,
  })),
  packagesSortedAndFiltered: createSelector(
    [getPackages, getVulnerabilities, getSorting, getFilter],
    (packages /*, vulnerabilities, sorting, filter*/) => packages /* &&
      vulnerabilities &&
      filterModes[filter](sortingModes[sorting](packages, vulnerabilities))*/
  ),
};
