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

        <CardGroup title='Vulnerable websites'>
          <CardListSkeleton />
        </CardGroup>
      </CardGroups>
    );
  }

  const popularQueries: KeyedPackagesBySourceCardProps[] = (
    showcase.showcase?.showcasedScans ?? []
  ).map(({ hostname, webPage, scanPreview }, idx) => ({
    id: idx.toString(),
    sourceIcon: '',
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
