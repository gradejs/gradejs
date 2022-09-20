import React from 'react';
import Hero from '../../ui/Hero/Hero';
import Container from 'components/ui/Container/Container';
import CardGroups from '../../ui/CardGroups/CardGroups';
import CardGroup from '../../ui/CardGroup/CardGroup';
import PopularPackageCardList from '../../ui/CardList/PopularPackageCardList';
import PackagesBySourceCardList from '../../ui/CardList/PackagesBySourceCardList';
import Footer from '../../ui/Footer/Footer';
import {
  packagesBySourceListData,
  popularPackageListData,
  scansWithVulnerabilitiesListData,
} from '../../../mocks/CardListsMocks';
import ScansWithVulnerabilitiesCardList from 'components/ui/CardList/ScansWithVulnerabilitiesCardList';

type Props = {
  loading?: boolean;
  onSubmit?: (site: string) => void;
  suggestions?: string[];
};

export default function Home({ suggestions, loading, onSubmit }: Props) {
  // TODO: replace mock data with real one
  return (
    <>
      <Hero suggestions={suggestions} onSubmit={onSubmit} loading={loading} />

      <Container>
        <CardGroups>
          <CardGroup title='Popular search queries'>
            <PackagesBySourceCardList cards={packagesBySourceListData} />
          </CardGroup>

          <CardGroup title='Popular packages'>
            <PopularPackageCardList cards={popularPackageListData} />
          </CardGroup>

          <CardGroup title='Vulnerable sites'>
            <ScansWithVulnerabilitiesCardList cards={scansWithVulnerabilitiesListData} />
          </CardGroup>

          <CardGroup title='Authors of popular packages'>
            <PackagesBySourceCardList cards={packagesBySourceListData} />
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
