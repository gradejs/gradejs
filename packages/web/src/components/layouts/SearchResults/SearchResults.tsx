import React from 'react';
import styles from './SearchResults.module.scss';
import Header from 'components/ui/Header/Header';
import Footer from 'components/ui/Footer/Footer';
import Container from 'components/ui/Container/Container';
import { Icon } from '../../ui/Icon/Icon';
import ChipGroup from '../../ui/ChipGroup/ChipGroup';
import PackagePreview from '../../ui/PackagePreview/PackagePreview';
import SearchBar from '../../ui/SearchBar/SearchBar';

type Props = {};

export default function SearchResults(props: Props) {
  return (
    <>
      <Header>
        <SearchBar value='pinterest.com/blog/%D0%92%D092%D092%D092%/dFD092fg092%D092%/dFD092/blog/%D0%92%D092%D092%D092%/dFD092fg092%D092%/dFD092f' />
      </Header>

      <Container>
        <div className={styles.searchResults}>
          <div className={styles.searchedPackage}>
            <div className={styles.searchedPackageImageWrapper}>
              <img
                className={styles.searchedPackageImage}
                src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
                alt=''
              />
            </div>
            <div className={styles.searchedPackageContent}>
              <h3 className={styles.searchedPackageTitle}>
                pinterest.com <span className={styles.searchedPackageHighlight}>6 packages</span>
              </h3>
              <div className={styles.searchedPackageSubtitle}>Last scanning 21 feb in 21:30</div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarItem}>
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='weight' width={24} height={24} />
                  </span>
                  <span className={styles.metaText}>159 kb webpack bundle size</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='search' width={24} height={24} />
                  </span>
                  <span className={styles.metaText}>50 scripts found</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='bug' width={24} height={24} color='#F3512E' />
                  </span>
                  <span className={styles.metaText}>6 vulnerabilities in 4&nbsp;packages</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='duplicate' color='#F3812E' width={24} height={24} />
                  </span>
                  <span className={styles.metaText}>12 duplicate packages</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>
                    <Icon kind='outdated' color='#F1CE61' stroke='white' width={24} height={24} />
                  </span>
                  <span className={styles.metaText}>18 outdated packages</span>
                </div>
              </div>
            </div>

            <div className={styles.sidebarItem}>
              <div className={styles.sidebarItemTop}>
                <div className={styles.sidebarItemTitle}>Keywords</div>
                <div className={styles.sidebarItemAction}>
                  <Icon kind='search' width={24} height={24} />
                </div>
              </div>

              <ChipGroup chips={['#moment', '#date', '#react', '#parse', '#fb']} />
              <span role='button' className={styles.viewAll}>
                View All
              </span>
            </div>

            <div className={styles.sidebarItem}>
              <div className={styles.sidebarItemTop}>
                <div className={styles.sidebarItemTitle}>Problem</div>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input type='checkbox' className={styles.checkboxInput} />
                  <span className={styles.checkboxName}>Vulnerabilities</span>
                </label>
                <label className={styles.checkbox}>
                  <input type='checkbox' className={styles.checkboxInput} />
                  <span className={styles.checkboxName}>Outdated</span>
                </label>
                <label className={styles.checkbox}>
                  <input type='checkbox' className={styles.checkboxInput} />
                  <span className={styles.checkboxName}>Duplicate</span>
                </label>
              </div>
            </div>

            <div className={styles.sidebarItem}>
              <div className={styles.sidebarItemTop}>
                <div className={styles.sidebarItemTitle}>Authors</div>
                <div className={styles.sidebarItemAction}>
                  <Icon kind='search' width={24} height={24} />
                </div>
              </div>

              <div className={styles.authors}>
                <div className={styles.author}>
                  <div className={styles.authorImageWrapper}>
                    <img
                      className={styles.authorImage}
                      src='https://via.placeholder.com/36'
                      alt=''
                    />
                  </div>
                  <div className={styles.authorName}>acdlite</div>
                </div>

                <div className={styles.author}>
                  <div className={styles.authorImageWrapper}>
                    <img
                      className={styles.authorImage}
                      src='https://via.placeholder.com/36'
                      alt=''
                    />
                  </div>
                  <div className={styles.authorName}>gaearon</div>
                </div>

                <div className={styles.author}>
                  <div className={styles.authorImageWrapper}>
                    <img
                      className={styles.authorImage}
                      src='https://via.placeholder.com/36'
                      alt=''
                    />
                  </div>
                  <div className={styles.authorName}>sophiebits</div>
                </div>

                <div className={styles.author}>
                  <div className={styles.authorImageWrapper}>
                    <img
                      className={styles.authorImage}
                      src='https://via.placeholder.com/36'
                      alt=''
                    />
                  </div>
                  <div className={styles.authorName}>trueadm</div>
                </div>
              </div>

              <span role='button' className={styles.viewAll}>
                View All
              </span>
            </div>
          </aside>

          <div className={styles.packages}>
            <PackagePreview
              name='@team-griffin/react-heading-section@team-griffin/react-heading-section'
              version='3.0.0 - 4.16.4'
            />
          </div>
        </div>
      </Container>

      <Footer />
    </>
  );
}
