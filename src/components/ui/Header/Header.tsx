/* eslint-disable react/button-has-type */
import React from 'react';
import Button from '../Button/Button';
import Logo from '../Logo/Logo';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.container}>
      <Logo />
      <Button size='medium'>Github</Button>
    </header>
  );
}
