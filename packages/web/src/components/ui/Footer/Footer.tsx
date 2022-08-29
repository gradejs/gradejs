import React from 'react';
import styles from './Footer.module.scss';
import Container from '../Container/Container';

export default function Footer() {
  return (
    <Container>
      <footer className={styles.footer}>
        <div className={styles.copyright}>
          <span className={styles.copyrightItem}>© 2022 GradeJS. All rights reserved.</span>
          <span className={styles.copyrightItem}>Designed by MAX</span>
        </div>
        <div className={styles.wrapper}>
          <div className={styles.links}>
            <a
              href='https://github.com/gradejs/gradejs/discussions/6'
              target='_blank'
              rel='noreferrer'
              className={styles.link}
            >
              About
            </a>
            <a
              href='https://github.com/gradejs/gradejs/discussions'
              target='_blank'
              rel='noreferrer'
              className={styles.link}
            >
              Community
            </a>
            <a
              href='https://github.com/gradejs/gradejs'
              target='_blank'
              rel='noreferrer'
              className={styles.link}
            >
              Github
            </a>
          </div>
          <div className={styles.links}>
            <a href='#' className={styles.link}>
              Popular packages
            </a>
            <a href='#' className={styles.link}>
              Go to search
            </a>
          </div>
        </div>
      </footer>
    </Container>
  );
}
