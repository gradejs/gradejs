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

export default function ShowcaseContainer() {
  const showcase = useShowcaseData();

  if (showcase.isLoading) {
    return (
      <CardGroups>
        <CardGroup title='Popular search queries'>
          <CardListSkeleton />
        </CardGroup>

        <CardGroup title='Vulnerable sites'>
          <CardListSkeleton />
        </CardGroup>
      </CardGroups>
    );
  }

  const popularQueries: KeyedPackagesBySourceCardProps[] = (
    showcase.showcase?.showcasedScans ?? []
  ).map((showcasedScan, idx) => ({
    id: idx.toString(),
    sourceIcon: '',
    sourceTitle: `${showcasedScan.hostname.hostname}${showcasedScan.webPage.path}`,
    packages: showcasedScan.scanPreview.packageNames,
    morePackagesCount:
      showcasedScan.scanPreview.totalCount - showcasedScan.scanPreview.packageNames.length,
  }));

  const scansWithVulnerabilities: KeyedScansWithVulnerabilitiesCardProps[] = (
    showcase.showcase?.scansWithVulnerabilities ?? []
  ).map((scanWithVulnerabilities, idx) => ({
    id: idx.toString(),
    sourcePageUrl: `${scanWithVulnerabilities.hostname.hostname}${scanWithVulnerabilities.webPage.path}`,
    vulnerablePackageName: scanWithVulnerabilities.vulnerabilities[0].affectedPackageName,
    additionalVulnerabilitiesCount: scanWithVulnerabilities.vulnerabilities.length - 1,
  }));

  return (
    <CardGroups>
      {!!popularQueries.length && (
        <CardGroup title='Popular search queries'>
          <PackagesBySourceCardList cards={popularQueries} />
        </CardGroup>
      )}

      {/*<CardGroup title='Popular packages'>*/}
      {/*  <PopularPackageCardList cards={popularPackageListData} />*/}
      {/*</CardGroup>*/}

      {!!scansWithVulnerabilities.length && (
        <CardGroup title='Vulnerable sites'>
          <ScansWithVulnerabilitiesCardList cards={scansWithVulnerabilities} />
        </CardGroup>
      )}

      {/*<CardGroup title='Authors of popular packages'>*/}
      {/*  <PackagesBySourceCardList cards={packagesBySourceListData} />*/}
      {/*</CardGroup>*/}
    </CardGroups>
  );
}
