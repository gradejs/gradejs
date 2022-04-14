/* eslint-disable react/button-has-type */
import React from 'react';
import styles from './Logo.module.scss';

export default function Logo() {
  // TODO: replace with a Link from react-router
  return (
    <a className={styles.logo} href='/'>
      GradeJS
      <span className={styles.version}>Beta</span>
    </a>
  );
}
