import React from 'react';
import Hero from '../../ui/Hero/Hero';
import Container from 'components/ui/Container/Container';
import CardList from '../../ui/CardList/CardList';
import CardGroups from '../../ui/CardGroups/CardGroups';
import Footer from '../../ui/Footer/Footer';
import CardGroup from '../../ui/CardGroup/CardGroup';

export type HomeNewProps = {
  suggestions: string[];
};

export default function HomeNew({ suggestions }: HomeNewProps) {
  const popularCards = [
    {
      title: 'github.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      title: 'fingerprint.com',
      icon: 'https://avatars.githubusercontent.com/u/67208791?s=200&v=4',
      packageTags: {
        featuredPackages: ['mdast-util-from-markdown', 'react', 'react-dom'],
        restPackages: 45,
      },
    },
    {
      title: 'facebook.com',
      icon: 'https://avatars.githubusercontent.com/u/69631?s=200&v=4',
      packageTags: {
        featuredPackages: ['react'],
        restPackages: 45,
      },
    },
  ];

  const popularPackages = [
    {
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
      title: 'Go to all Popular packages',
      variant: 'toAll',
    },
  ];

  const vulnerablePackages = [
    {
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
      },
      variant: 'vulnerable',
    },
    {
      title: 'disneyland.omsk.ru/signup',
      vulnerablePackage: {
        name: 'mdast-util-from-markdown',
        moreCount: 1,
      },
      variant: 'vulnerable',
    },
    {
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
