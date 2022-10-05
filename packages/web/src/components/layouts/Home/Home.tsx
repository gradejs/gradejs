import React from 'react';
import Hero from '../../ui/Hero/Hero';
import Container from 'components/ui/Container/Container';
import Footer from '../../ui/Footer/Footer';
import ShowcaseContainer from '../../containers/ShowcaseContainer';

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
        <ShowcaseContainer />
      </Container>

      <Footer />
    </>
  );
}
