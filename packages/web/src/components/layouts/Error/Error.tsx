import React from 'react';
import styles from './Error.module.scss';
import Container from 'components/ui/Container/Container';
import SearchBar from '../../ui/SearchBar/SearchBar';
import CardGroup from '../../ui/CardGroup/CardGroup';
import CardGroups from '../../ui/CardGroups/CardGroups';
import Footer from '../../ui/Footer/Footer';
import StickyErrorHeader from '../../ui/Header/StickyErrorHeader';
import { CardChipsProps } from '../../ui/Card/CardChips';
import { CardPopularProps } from '../../ui/Card/CardPopular';
import CardListChips from '../../ui/CardList/CardListChips';
import CardListPopular from '../../ui/CardList/CardListPopular';

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
  // TODO: mock data, remove later
  const similarCards: CardChipsProps[] = [
    {
      id: 'uExBVGuF',
      title: 'github.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      chips: ['mdast-util-from-markdown', 'react', 'react-dom'],
      restPackages: 45,
    },
    {
      id: '1EkL1u5g',
      title: 'fingerprint.com',
      icon: 'https://avatars.githubusercontent.com/u/67208791?s=200&v=4',
      chips: ['mdast-util-from-markdown', 'react', 'react-dom'],
      restPackages: 45,
    },
    {
      id: 'mhwO2bPM',
      title: 'facebook.com',
      icon: 'https://avatars.githubusercontent.com/u/69631?s=200&v=4',
      chips: ['react'],
      restPackages: 45,
    },
  ];

  // TODO: mock data, remove later
  const popularPackages: CardPopularProps[] = [
    {
      id: 'FPsBcl8R',
      title: '@team-griffin/react-heading-section',
      description: "This package's job is to automatically determine...",
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'emtYcsUh',
      title: 'unist-util-generated',
      description: 'unist utility to check if a node is generated',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'TYIwvAfy',
      title: 'react-smooth',
      description: 'is a animation library work on React',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'Lq1pEEX7',
      title: 'unist-util-position',
      description: 'unist utility to get the positional info of nodes',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
    {
      id: 'cWOgIbmp',
      title: 'vfile-message',
      description: 'Create vfile messages',
      imagesList: [
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      ],
      numberOfUses: 5265,
    },
  ];

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
            <CardListChips cards={similarCards} />
          </CardGroup>

          <CardGroup title='Popular packages'>
            <CardListPopular cards={popularPackages} />
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
