import semver from 'semver';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../';
import type { ClientApi } from '../../services/apiClient';

function semverListAsRange(versionList: string[]) {
  if (!versionList.length) {
    return '*';
  }

  if (versionList.length === 1) {
    return versionList[0];
  }

  const sortedVersions = versionList.sort(semver.compare);

  return `${sortedVersions[0]} - ${sortedVersions[sortedVersions.length - 1]}`;
}

export type IdentifiedPackage = ClientApi.ScanResultPackageResponse & {
  approximateByteSize?: number;
  outdated?: boolean;
  vulnerable?: boolean;
  duplicate?: boolean;
  version?: string;
};

const makeSelectScanResultByUrl = () =>
  createSelector(
    [(state: RootState) => state.scans, (state: RootState, url: string | undefined) => url],
    (scans, url) => (url ? scans[url] : undefined)
  );

const makeSelectScanPackagesByUrl = () =>
  createSelector([makeSelectScanResultByUrl()], (scanResult) => {
    const scanData = scanResult?.scan?.scanResult;
    if (!scanData) {
      return undefined;
    }

    const rawPackages = scanData.identifiedPackages;

    const packages: IdentifiedPackage[] = rawPackages.map((pkg) => {
      return {
        ...pkg,
        approximateByteSize: pkg.moduleIds.reduce((acc: number, id) => {
          const size = scanData.identifiedModuleMap?.[id]?.approximateByteSize ?? 0;
          return acc + size;
        }, 0),
        outdated: (
          pkg.registryMetadata &&
          !pkg.versionSet.some(
            (ver) => pkg.registryMetadata && semver.eq(pkg.registryMetadata.latestVersion, ver)
          )
        ),
        vulnerable: (scanData.vulnerabilities[pkg.name]?.length ?? 0) > 0,
        version: semverListAsRange(pkg.versionSet),
      };
    });

    return packages;
  });

export const selectors = {
  scanState: createSelector([makeSelectScanResultByUrl()], (scanResult) => ({
    isLoading: scanResult?.isLoading ?? true,
    isFailed: !!scanResult?.error,
    isPending: scanResult?.scan?.status === 'pending',
    isProtected: scanResult?.scan?.status === 'protected',
    isInvalid: scanResult?.scan?.scanResult?.identifiedPackages.length === 0,
  })),
  scanOverview: createSelector([makeSelectScanResultByUrl()], (scanResult) => {
    const scanData = scanResult?.scan?.scanResult;

    const vulnerabilities = scanData?.vulnerabilities ?? {};
    const identifiedPackages = scanData?.identifiedPackages ?? [];

    const packageKeywords = new Set(
      identifiedPackages.reduce((acc, pkg) => {
        return acc.concat(pkg.registryMetadata?.keywords ?? []);
      }, [] as string[])
    );

    const uniqueVulnerabilities = new Set(
      Object.values(vulnerabilities ?? {})
        .flat()
        .map((v) => v.osvId)
    );

    return {
      vulnerabilities,
      vulnerabilityCount: uniqueVulnerabilities.size,
      packageKeywordList: Array.from(packageKeywords),
    };
  }),
  packagesStats: createSelector([makeSelectScanPackagesByUrl()], (packages = []) => ({
    total: packages.length,
    vulnerable: packages.filter((pkg) => !!pkg.vulnerable).length,
    outdated: packages.filter((pkg) => !!pkg.outdated).length,
  })),
  packagesSortedAndFiltered: createSelector([makeSelectScanPackagesByUrl()], (packages) => {
    // TODO: Reimplement filters and sorters

    return packages;
  }),
};

export { makeSelectScanResultByUrl };
