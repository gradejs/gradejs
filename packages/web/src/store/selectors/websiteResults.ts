import semver from 'semver';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../';
import { IdentifiedPackage } from '../../types';

function semverListAsRange(versionList: string[]) {
  if (!versionList.length) {
    return 'x.x.x';
  }

  if (versionList.length === 1) {
    return versionList[0];
  }

  const sortedVersions = versionList.slice().sort(semver.compare);

  return `${sortedVersions[0]} - ${sortedVersions[sortedVersions.length - 1]}`;
}

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
        outdated:
          pkg.versionSet.length > 0 &&
          pkg.registryMetadata &&
          !pkg.versionSet.some(
            (ver) => pkg.registryMetadata && semver.eq(pkg.registryMetadata.latestVersion, ver)
          ),
        vulnerable: (scanData.vulnerabilities[pkg.name]?.length ?? 0) > 0, // TODO: Drop
        vulnerabilities: scanData.vulnerabilities[pkg.name] ?? [],
        version: semverListAsRange(pkg.versionSet),
        // TODO: memoize/simplify
        containingScripts: Array.from(
          pkg.moduleIds.reduce((acc: Set<string>, id) => {
            const script = scanData?.processedScripts?.find(
              (val) => val.status === 'processed' && val.moduleIds.includes(id)
            );
            if (script) {
              acc.add(script.url);
            }
            return acc;
          }, new Set<string>())
        ),
        modules: pkg.moduleIds.map((it) => scanData.identifiedModuleMap[it]),
      };
    });

    return packages;
  });

export const selectors = {
  scanState: createSelector([makeSelectScanResultByUrl()], (scanResult) => ({
    isLoading: scanResult?.isLoading ?? true,
    isFailed: !!scanResult?.error,
    isNotFound: scanResult?.error?.code === 'NOT_FOUND',
    isPending: scanResult?.scan?.status === 'pending',
    isProtected: scanResult?.scan?.status === 'protected',
    isInvalid:
      scanResult?.scan?.status === 'failed' ||
      scanResult?.scan?.scanResult?.identifiedPackages.length === 0,
    isRescanAvailable: !!scanResult?.scan?.isRescanAvailable,
  })),
  scanOverview: createSelector(
    [makeSelectScanResultByUrl(), makeSelectScanPackagesByUrl()],
    (scanResult, identifiedPackages = []) => {
      const scanData = scanResult?.scan?.scanResult;

      const vulnerabilities = scanData?.vulnerabilities ?? {};

      const uniqueVulnerabilities = new Set(
        Object.values(vulnerabilities ?? {})
          .flat()
          .map((v) => v.osvId)
      );

      return {
        vulnerabilities: {
          total: uniqueVulnerabilities.size,
        },
        packages: {
          total: identifiedPackages.length,
          vulnerable: identifiedPackages.filter((pkg) => !!pkg.vulnerable).length,
          outdated: identifiedPackages.filter((pkg) => !!pkg.outdated).length,
        },
        scriptsCount: scanData?.processedScripts?.length,
        bundleSize: scanData?.processedScripts?.reduce((acc, script) => {
          return acc + (script.byteSize ?? 0);
        }, 0),
      };
    }
  ),
  searchableScanEntities: createSelector([makeSelectScanPackagesByUrl()], (packages = []) => {
    const packageKeywords = new Set<string>();
    const packageAuthors = new Map<string, { name: string; avatar: string }>();

    for (const pkg of packages) {
      pkg.registryMetadata?.keywords?.forEach((keyword) => packageKeywords.add(keyword));
      pkg.registryMetadata?.maintainers?.forEach((maintainer) =>
        packageAuthors.set(maintainer.name, maintainer)
      );
    }

    return {
      packageKeywords: Array.from(packageKeywords),
      packageAuthors: Array.from(packageAuthors.values()),
    };
  }),
};

export { makeSelectScanResultByUrl, makeSelectScanPackagesByUrl };
