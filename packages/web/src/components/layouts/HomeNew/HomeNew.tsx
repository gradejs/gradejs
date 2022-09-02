import React from 'react';
import { CardProps } from '../../ui/Card/Card';
import Hero from '../../ui/Hero/Hero';
import Container from 'components/ui/Container/Container';
import CardList from '../../ui/CardList/CardList';
import CardGroups from '../../ui/CardGroups/CardGroups';
import Footer from '../../ui/Footer/Footer';
import CardGroup from '../../ui/CardGroup/CardGroup';

type Props = {
  suggestions: string[];
};

export default function HomeNew({ suggestions }: Props) {
  // TODO: mock date, remove later
  const popularCards: CardProps[] = [
    {
      id: 'uExBVGuF',
      title: 'github.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      id: '1EkL1u5g',
      title: 'fingerprint.com',
      icon: 'https://avatars.githubusercontent.com/u/67208791?s=200&v=4',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      id: 'mhwO2bPM',
      title: 'facebook.com',
      icon: 'https://avatars.githubusercontent.com/u/69631?s=200&v=4',
      packageTags: {
        featuredPackages: ['react'],
        restPackages: 45,
      },
    },
  ];

  // TODO: mock date, remove later
  const popularPackages: CardProps[] = [
    {
      id: 'FPsBcl8R',
      title: '@team-griffin/react-heading-section',
      description: "This package's job is to automatically determine...",
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'emtYcsUh',
      title: 'unist-util-generated',
      description: 'unist utility to check if a node is generated',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'TYIwvAfy',
      title: 'react-smooth',
      description: 'is a animation library work on React',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'Lq1pEEX7',
      title: 'unist-util-position',
      description: 'unist utility to get the positional info of nodes',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'cWOgIbmp',
      title: 'vfile-message',
      description: 'Create vfile messages',
      featuredSites: {
        iconList: [
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        ],
        numberOfUses: 5265,
      },
    },
    {
      id: 'UT97Vpoi',
      title: 'Go to all Popular packages',
      variant: 'toAll',
    },
  ];

  // TODO: mock date, remove later
  const vulnerablePackages: CardProps[] = [
    {
      id: 'LnO9Xynn',
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
      },
      variant: 'vulnerable',
    },
    {
      id: '-A74UAy8',
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
        moreCount: 1,
      },
      variant: 'vulnerable',
    },
    {
      id: 'DPa05I2W',
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
      },
      variant: 'vulnerable',
    },
  ];

  return (
    <>
      <Hero suggestions={suggestions} />

      <Container>
        <CardGroups>
          <CardGroup title='Popular search queries'>
            <CardList cards={popularCards} />
          </CardGroup>

          <CardGroup title='Popular packages'>
            <CardList cards={popularPackages} />
          </CardGroup>

          <CardGroup title='Vulnerable sites'>
            <CardList cards={vulnerablePackages} variant='vertical' />
          </CardGroup>

          <CardGroup title='Authors of popular packages'>
            <CardList cards={popularCards} />
          </CardGroup>
        </CardGroups>
      </Container>

      <Footer />
    </>
  );
}
