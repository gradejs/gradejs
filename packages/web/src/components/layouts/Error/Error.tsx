import React from 'react';
import styles from './Error.module.scss';
import Container from 'components/ui/Container/Container';
import SearchBar from '../../ui/SearchBar/SearchBar';
import CardGroup from '../../ui/CardGroup/CardGroup';
import CardGroups from '../../ui/CardGroups/CardGroups';
import Footer from '../../ui/Footer/Footer';
import StickyErrorHeader from '../../ui/Header/StickyErrorHeader';
import PackagesBySourceCardList from '../../ui/CardList/PackagesBySourceCardList';
import PopularPackageCardList from '../../ui/CardList/PopularPackageCardList';
import { packagesBySourceListData, popularPackageListData } from '../../../mocks/CardListsMocks';

export type Props = {
  host: string;
  message?: string;
  action?: string;
  actionTitle?: string;
};

export default function Error({
  host,
  message = 'It looks like the entered website is not built with Webpack',
  action = 'GradeJS will analyze production JavaScript files and match webpack bundled modules to 1,826 indexed NPM libraries over 54,735 releases',
  actionTitle,
}: Props) {
  return (
    <>
      <StickyErrorHeader />

      <Container>
        <section className={styles.errorPage}>
          <div className={styles.textContent}>
            <p className={styles.host}>{host}</p>
            <h2 className={styles.heading}>{message}</h2>
            {action && <p className={styles.desc}>{action}</p>}
          </div>

          <div className={styles.searchWrapper}>
            <SearchBar size='large' placeholder={actionTitle} />
          </div>
        </section>

        {/* TODO: Trying to fit separate domain entities within a single component seems like burden.
                  Feels like these <CardList/>'s should be separate components. */}
        <CardGroups>
          <CardGroup title='But we have'>
            <PackagesBySourceCardList cards={packagesBySourceListData} />
          </CardGroup>

          <CardGroup title='Popular packages'>
            <PopularPackageCardList cards={popularPackageListData} />
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
