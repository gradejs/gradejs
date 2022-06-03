import React, { useEffect, useState } from 'react';
import semver from 'semver';
import { useParams, Navigate } from 'react-router-dom';
import { Error as ErrorLayout, Website } from 'components/layouts';
import { SubmitHandler } from "react-hook-form";
import { FormData } from "../layouts/Filters/Filters";
import { DetectedPackageData } from "../ui/Package/Package";

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

export default function WebsiteHostnamePage() {
  const { hostname } = useParams();
  const [packages, setPackages] = useState<DetectedPackageData[]>([]);
  const [webpages, setWebpages] = useState<{ status: string }[]>([]);
  const [isError, setError] = useState(false);
  const [isProtected, setProtected] = useState(false);

  const [packagesFiltered, setPackagesFiltered] = useState<DetectedPackageData[]>([]);

  const applyFilters: SubmitHandler<FormData> = (filters) => {
    const packagesShallowCopy = [...packages];
    switch (filters.sort) {
      case 'confidenceScore':
        // TODO
        break;
      case 'packagePopularity':
        // TODO
        break;
      case 'importDepth':
        // TODO
        break;
      case 'severity':
        // TODO
        break;
      case 'size':
        setPackages(packagesShallowCopy.sort((left, right) => Math.sign(
          (left.packageMetadata?.approximateByteSize || 0) - (right.packageMetadata?.approximateByteSize || 0)
        )));
        break;
      case 'name':
      default:
        // eslint-disable-next-line no-nested-ternary
        setPackages(packagesShallowCopy.sort((left, right) => (left.packageName.toLowerCase() < right.packageName.toLowerCase())
          ? -1
          : (left.packageName.toLowerCase() > right.packageName.toLowerCase())
            ? 1
            : 0
        ));
    }

    switch (filters.filter) {
      case 'name':
        if (filters.filterPackageName) {
          setPackagesFiltered(packagesShallowCopy.filter((pkg) => pkg.packageName.includes(filters.filterPackageName || '')));
        } else {
          setPackagesFiltered(packagesShallowCopy);
        }
        break;
      case 'outdated':
        setPackagesFiltered(packagesShallowCopy.filter((pkg) => (
          pkg.registryMetadata &&
          semver.gtr(pkg.registryMetadata.latestVersion, pkg.packageVersionRange))
        ));
        break;
      case 'vulnerable':
        // TODO
        break;
      case 'all':
      default:
        setPackagesFiltered(packagesShallowCopy);
    }
  };

  const isInvalidResult =
    packages.length === 0 &&
    webpages.length > 0 &&
    !webpages.find((item) => item.status === 'pending');

  useEffect(() => {
    if (hostname) {
      fetchApi(hostname)
        .then((response) => {
          setPackages(response.data.packages);
          setPackagesFiltered(response.data.packages);
          setWebpages(response.data.webpages);
          setProtected(
            !!response.data.webpages.find((item: { status: string }) => item.status === 'protected')
          );
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
            setPackages(response.data.packages);
            setPackagesFiltered(response.data.packages);
            setWebpages(response.data.webpages);
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

  return <Website
    webpages={webpages}
    packages={packagesFiltered}
    host={hostname}
    onFiltersApply={applyFilters}
  />;
}
