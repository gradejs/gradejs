import React, { useCallback, useEffect, useMemo, useState } from 'react';
import semver from 'semver';
import { useParams, Navigate } from 'react-router-dom';
import { Error as ErrorLayout, Website } from 'components/layouts';
import { DefaultFiltersAndSorters } from '../layouts/Filters/Filters';
import { DetectedPackageData } from '../ui/Package/Package';
import { PackageVulnerabilityData, SeverityWeightMap } from '../ui/Vulnerability/Vulnerability';

const baseUrl = process.env.API_ORIGIN;

async function fetchApi(hostname: string) {
  return fetch(`${baseUrl}/website/${hostname}`).then((response) => {
    if (response.status !== 200) {
      throw new Error();
    } else {
      return response.json();
    }
  });
}

type DetectionResult = {
  packages: DetectedPackageData[];
  vulnerabilities: Record<string, PackageVulnerabilityData[]>;
  webpages: Array<{ status: string }>;
};

const compareByPopularity = (left: DetectedPackageData, right: DetectedPackageData) =>
  (right.registryMetadata?.monthlyDownloads || 0) - (left.registryMetadata?.monthlyDownloads || 0);

export default function WebsiteHostnamePage() {
  const { hostname } = useParams();
  const [detectionResult, setDetectionResult] = useState<DetectionResult>({
    packages: [],
    vulnerabilities: {},
    webpages: [],
  });
  const [isError, setError] = useState(false);
  const [filters, setFilters] = useState(DefaultFiltersAndSorters);

  const { webpages, vulnerabilities, packages } = detectionResult;

  const isProtected = useMemo(
    () => webpages.find((item: { status: string }) => item.status === 'protected'),
    [webpages]
  );

  const pickHighestSeverity = useCallback(
    (packageName: string) => {
      const packageVulnerabilities = vulnerabilities[packageName] ?? [];

      return packageVulnerabilities
        .map((it) => it.severity)
        .filter((it): it is string => !!it)
        .reduce(
          (acc, val) => (SeverityWeightMap[acc] > SeverityWeightMap[val] ? acc : val),
          'UNKNOWN'
        );
    },
    [vulnerabilities]
  );

  const packagesFiltered = useMemo(() => {
    let packagesShallowCopy = [...packages];
    switch (filters.sort) {
      case 'confidenceScore':
        // TODO
        break;
      case 'importDepth':
        // TODO
        break;
      case 'severity':
        packagesShallowCopy = packagesShallowCopy.sort((left, right) => {
          const leftSeverity = pickHighestSeverity(left.packageName);
          const rightSeverity = pickHighestSeverity(right.packageName);

          if (leftSeverity !== rightSeverity) {
            return SeverityWeightMap[rightSeverity] - SeverityWeightMap[leftSeverity];
          }

          return compareByPopularity(left, right);
        });
        break;
      case 'size':
        packagesShallowCopy = packagesShallowCopy.sort(
          (left, right) =>
            (right.packageMetadata?.approximateByteSize || 0) -
            (left.packageMetadata?.approximateByteSize || 0)
        );
        break;
      case 'name':
        packagesShallowCopy = packagesShallowCopy.sort((left, right) =>
          left.packageName.localeCompare(right.packageName)
        );
        break;
      case 'packagePopularity':
      default:
        packagesShallowCopy = packagesShallowCopy.sort(compareByPopularity);
    }

    switch (filters.filter) {
      case 'name':
        if (filters.filterPackageName) {
          packagesShallowCopy = packagesShallowCopy.filter((pkg) =>
            pkg.packageName.includes(filters.filterPackageName || '')
          );
        }
        break;

      case 'outdated':
        packagesShallowCopy = packagesShallowCopy.filter(
          (pkg) =>
            pkg.registryMetadata &&
            semver.gtr(pkg.registryMetadata.latestVersion, pkg.packageVersionRange)
        );
        break;
      case 'vulnerable':
        packagesShallowCopy = packagesShallowCopy.filter(
          (pkg) => !!vulnerabilities[pkg.packageName]
        );
        break;
      case 'all':
      default:
        break;
    }

    return packagesShallowCopy;
  }, [vulnerabilities, packages, filters]);

  const isInvalidResult =
    packages.length === 0 &&
    webpages.length > 0 &&
    !webpages.find((item) => item.status === 'pending');

  useEffect(() => {
    if (hostname) {
      fetchApi(hostname)
        .then((response) => {
          setDetectionResult({
            vulnerabilities: {},
            ...response.data,
          });
        })
        .catch(() => {
          setError(true);
        });
    }
  }, []);

  useEffect(() => {
    const hasPendingPages = !!webpages.find((item) => item.status === 'pending');

    if (hasPendingPages && hostname) {
      const timeoutId = setTimeout(() => {
        fetchApi(hostname)
          .then((response) => {
            setDetectionResult({
              vulnerabilities: {},
              ...response.data,
            });
          })
          .catch(() => {
            setError(true);
          });
      }, 5000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [webpages]);

  if (!hostname || isError) {
    return <Navigate replace to='/' />;
  }

  if (isProtected) {
    return (
      <ErrorLayout
        message='The entered website appears to be protected by a third-party service, such as DDoS prevention, password protection or geolocation restrictions.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={hostname}
        onRetry={() => {
          document.location = '/';
        }}
      />
    );
  }

  if (isInvalidResult) {
    return (
      <ErrorLayout
        message='It looks like the entered website is not built with Webpack.'
        action='Would you like to try another URL or report an issue?'
        actionTitle='Try another URL'
        host={hostname}
        onRetry={() => {
          document.location = '/';
        }}
      />
    );
  }

  return (
    <Website
      webpages={webpages}
      packages={packagesFiltered}
      host={hostname}
      vulnerabilities={vulnerabilities}
      onFiltersApply={setFilters}
    />
  );
}
