import React from 'react';
import Hero from '../../ui/Hero/Hero';
import Container from 'components/ui/Container/Container';
import Footer from '../../ui/Footer/Footer';
import ShowcaseContainer from '../../containers/ShowcaseContainer';

type Props = {
  suggestions?: string[];
};

export default function Home({ suggestions }: Props) {
  return (
    <>
      <Hero suggestions={suggestions} />

      <Container>
        <ShowcaseContainer />
      </Container>

      <Footer />
    </>
  );
}
