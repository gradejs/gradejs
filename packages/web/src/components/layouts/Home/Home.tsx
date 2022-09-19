import React from 'react';
import Hero from '../../ui/Hero/Hero';
import Container from 'components/ui/Container/Container';
import CardGroups from '../../ui/CardGroups/CardGroups';
import CardGroup from '../../ui/CardGroup/CardGroup';
import CardListPopular from '../../ui/CardList/CardListPopular';
import { CardPopularProps } from '../../ui/Card/CardPopular';
import CardListChips from '../../ui/CardList/CardListChips';
import { CardChipsProps } from '../../ui/Card/CardChips';
import CardVulnerableList from '../../ui/CardList/CardListVulnerable';
import { CardVulnerableProps } from '../../ui/Card/CardVulnerable';
import Footer from '../../ui/Footer/Footer';

type Props = {
  loading?: boolean;
  onSubmit?: (site: string) => void;
  suggestions?: string[];
};

export default function Home({ suggestions, loading, onSubmit }: Props) {
  // TODO: mock data, remove later
  const popularCards: CardChipsProps[] = [
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

  // TODO: mock data, remove later
  const vulnerablePackages: CardVulnerableProps[] = [
    {
      id: 'LnO9Xynn',
      title: 'disneyland.omsk.ru/signup',
      vulnerableName: 'mdast-util-from-markdown',
    },
    {
      id: '-A74UAy8',
      title: 'disneyland.omsk.ru/signup',
      vulnerableName: 'mdast-util-from-markdown',
      vulnerableMore: 1,
    },
    {
      id: 'DPa05I2W',
      title: 'disneyland.omsk.ru/signup',
      vulnerableName: 'mdast-util-from-markdown',
    },
  ];

  return (
    <>
      <Hero suggestions={suggestions} onSubmit={onSubmit} loading={loading} />

      <Container>
        <CardGroups>
          <CardGroup title='Popular search queries'>
            <CardListChips cards={popularCards} />
          </CardGroup>

          <CardGroup title='Popular packages'>
            <CardListPopular cards={popularPackages} />
          </CardGroup>

          <CardGroup title='Vulnerable sites'>
            <CardVulnerableList cards={vulnerablePackages} />
          </CardGroup>

          <CardGroup title='Authors of popular packages'>
            <CardListChips cards={popularCards} />
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
