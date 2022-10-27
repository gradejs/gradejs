import React from 'react';
import { useShowcaseData } from '../../store/hooks/scan/useShowcaseData';
import PackagesBySourceCardList, {
  KeyedPackagesBySourceCardProps,
} from '../ui/CardList/PackagesBySourceCardList';
import CardGroup from '../ui/CardGroup/CardGroup';
import CardGroups from '../ui/CardGroups/CardGroups';
import ScansWithVulnerabilitiesCardList, {
  KeyedScansWithVulnerabilitiesCardProps,
} from '../ui/CardList/ScansWithVulnerabilitiesCardList';
import { CardListSkeleton } from '../ui/CardList/CardListSkeleton';
import { getFaviconUrlByHostname } from 'utils/helpers';
import PopularPackageCardList, {
  KeyedPopularPackageCardProps,
} from '../ui/CardList/PopularPackageCardList';

export default function ShowcaseContainer() {
  const showcase = useShowcaseData();

  if (showcase.isLoading) {
    return (
      <CardGroups>
        <CardGroup title='Popular search queries'>
          <CardListSkeleton />
        </CardGroup>

        <CardGroup title='Vulnerable websites'>
          <CardListSkeleton />
        </CardGroup>

        <CardGroup title='Popular packages'>
          <CardListSkeleton />
        </CardGroup>
      </CardGroups>
    );
  }

  const popularQueries: KeyedPackagesBySourceCardProps[] = (
    showcase.showcase?.showcasedScans ?? []
  ).map(({ hostname, webPage, scanPreview }, idx) => ({
    id: idx.toString(),
    sourceIcon: getFaviconUrlByHostname(hostname.hostname),
    sourceTitle: `${hostname.hostname}`,
    sourceUrl: `/scan/${hostname.hostname}${webPage.path}`,
    packages: scanPreview.packageNames,
    morePackagesCount: scanPreview.totalCount - scanPreview.packageNames.length,
  }));

  const scansWithVulnerabilities: KeyedScansWithVulnerabilitiesCardProps[] = (
    showcase.showcase?.scansWithVulnerabilities ?? []
  ).map(({ hostname, webPage, vulnerabilities }, idx) => ({
    id: idx.toString(),
    sourceTitle: `${hostname.hostname}${webPage.path}`,
    sourceUrl: `/scan/${hostname.hostname}${webPage.path}`,
    vulnerablePackageName: vulnerabilities[0].packageName,
    additionalVulnerabilitiesCount: vulnerabilities.length - 1,
  }));

  const popularPackages: KeyedPopularPackageCardProps[] = (
    showcase.showcase?.showcasedPackages ?? []
  ).map((pkg) => ({
    id: pkg.name,
    packageName: pkg.name,
    hostsFaviconList: [], // TODO: Add favicons
    packageDescription: pkg.description,
    totalUsageCount: pkg.usageByHostnameCount ?? 0,
  }));

  return (
    <CardGroups>
      {!!popularQueries.length && (
        <CardGroup title='Popular search queries'>
          <PackagesBySourceCardList cards={popularQueries} />
        </CardGroup>
      )}

      <CardGroup title='Popular packages'>
        <PopularPackageCardList cards={popularPackages} />
      </CardGroup>

      {!!scansWithVulnerabilities.length && (
        <CardGroup title='Vulnerable websites'>
          <ScansWithVulnerabilitiesCardList cards={scansWithVulnerabilities} />
        </CardGroup>
      )}

      {/*<CardGroup title='Authors of popular packages'>*/}
      {/*  <PackagesBySourceCardList cards={packagesBySourceListData} />*/}
      {/*</CardGroup>*/}
    </CardGroups>
  );
}
