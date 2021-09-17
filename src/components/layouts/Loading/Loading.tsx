/* eslint-disable react/button-has-type */
import React from 'react';
import { Header, Section } from 'components/ui';
import styles from './Loading.module.scss';

export default function Loading() {
  return (
    <>
      <Header />
      <Section>
        <h2 className={styles.heading}>Loading, please wait</h2>
      </Section>
    </>
  );
}
