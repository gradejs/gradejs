import React, { useState } from 'react';
import styles from './PackagePreview.module.scss';
import { Icon } from '../Icon/Icon';
import Chip from '../Chip/Chip';
import clsx from 'clsx';
import ChipGroup from '../ChipGroup/ChipGroup';
import SitesList, { Site } from '../SitesList/SitesList';
import { CSSTransition } from 'react-transition-group';
import Button from '../Button/Button';

type Props = {
  name: string;
  version: string;
  opened?: boolean;
};

export default function PackagePreview({ name, version, opened }: Props) {
  const [open, setOpen] = useState<boolean>(opened ?? false);

  // TODO: mock data, remove later
  const sites: Site[] = [
    {
      id: '123',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '456',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '789',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '1231',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '12321',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '123123',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
    {
      id: '12123132',
      image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
      name: 'pinterest.com',
      packagesCount: 151,
    },
  ];

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={clsx(styles.package, open && styles.open)}>
      <header className={styles.header}>
        <div className={styles.top} onClick={toggleOpen}>
          <div className={styles.title}>
            <span className={styles.name}>
              {name} <span className={styles.version}>{version}</span>
            </span>
            <span className={styles.problems}>
              <Chip
                variant='vulnerability'
                size='badge'
                icon={<Icon kind='bug' width={24} height={24} color='white' />}
              >
                Vulnerabilities
              </Chip>
              <Chip
                variant='duplicate'
                size='badge'
                icon={<Icon kind='duplicate' width={24} height={24} color='white' />}
              >
                Duplicate
              </Chip>
              <Chip
                variant='outdated'
                size='badge'
                icon={
                  <Icon kind='outdated' width={24} height={24} color='white' stroke='#F1CE61' />
                }
              >
                Outdated
              </Chip>
            </span>
          </div>

          <button type='button' className={styles.arrowWrapper} onClick={toggleOpen}>
            {/* FIXME: requires different smaller svg icon for mobile and makes button 24x24 */}
            {/* which is probably not optimal UX */}
            <Icon kind='arrowDown' width={14} height={8} color='#8E8AA0' className={styles.arrow} />
          </button>
        </div>

        <div className={styles.desc}>
          The Lodash library exported as ES modules. Generated using lodash-cli
        </div>
      </header>

      <CSSTransition
        in={open}
        timeout={600}
        classNames={{
          enterDone: styles.contentEnterDone,
        }}
      >
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='script' color='#8E8AA0' className={styles.statIcon} />
                Script
              </div>
              <a href='#' className={styles.statLink} target='_blank' rel='noreferrer'>
                /rsrc.php/v3id044/yu/l/en_US/yD2XaVkWQHO.js?_nc_x=Ij3Wp8lg5Kz
              </a>
            </div>

            <div className={styles.statList}>
              <div className={clsx(styles.stat, styles.statListItemSmall)}>
                <div className={styles.statHeader}>
                  <Icon kind='license' color='#8E8AA0' className={styles.statIcon} />
                  License
                </div>
                <div className={styles.statTitle}>MIT license</div>
                <div className={styles.statSubtitle}>freely distributable</div>
              </div>

              <div className={clsx(styles.stat, styles.statListItemSmall)}>
                <div className={styles.statHeader}>
                  <Icon kind='rating' color='#8E8AA0' className={styles.statIcon} />
                  Rating
                </div>
                <div className={styles.statTitle}>
                  385
                  {/* or: <div className={clsx(styles.statRating, styles.statRatingRed)}> */}
                  <div className={clsx(styles.statRating, styles.statRatingGreen)}>
                    <Icon
                      kind='ratingArrow'
                      width={12}
                      height={12}
                      className={styles.statRatingArrow}
                    />
                    +4
                  </div>
                </div>
                <div className={styles.statSubtitle}>out of 12 842</div>
              </div>

              <div className={clsx(styles.stat, styles.statListItemLarge)}>
                <div className={styles.statHeader}>
                  <Icon kind='dependency' color='#8E8AA0' className={styles.statIcon} />4 Dependency
                </div>
                <ChipGroup
                  chips={['art', 'create-react-class', 'loose-envify', 'scheduler']}
                  fontSize='small'
                />
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='graph' color='#8E8AA0' className={styles.statIcon} />
                Versions popularity by uses on sites
              </div>

              <div className={styles.popularity}>
                <div className={styles.popularityItemWrapper}>
                  <div className={styles.popularityItem}>
                    <div className={styles.popularityFill} style={{ height: '100%' }}>
                      89 912
                    </div>
                  </div>

                  <div className={styles.popularityVersion}>21.3.0</div>
                </div>

                <div className={styles.popularityItemWrapper}>
                  <div className={styles.popularityItem}>
                    <div
                      className={clsx(styles.popularityFill, styles.popularityFillAccent)}
                      style={{ height: '90%' }}
                    >
                      67 111
                    </div>
                  </div>

                  <div className={styles.popularityVersion}>18.2.0</div>
                </div>

                <div className={styles.popularityItemWrapper}>
                  <div className={styles.popularityItem}>
                    <div className={styles.popularityFill} style={{ height: '80%' }}>
                      44 212
                    </div>
                  </div>

                  <div className={styles.popularityVersion}>20.1.0</div>
                </div>

                <div className={styles.popularityItemWrapper}>
                  <div className={styles.popularityItem}>
                    <div className={styles.popularityFill} style={{ height: '70%' }}>
                      41 129
                    </div>
                  </div>

                  <div className={styles.popularityVersion}>18.0.0</div>
                </div>

                <div className={styles.popularityItemWrapper}>
                  <div className={styles.popularityItem}>
                    <div className={styles.popularityFill} style={{ height: '60%' }}>
                      40 465
                    </div>
                  </div>

                  <div className={styles.popularityVersion}>19.11.2</div>
                </div>

                <div className={styles.popularityItemWrapper}>
                  <div className={styles.popularityItem}>
                    <div className={styles.popularityFill} style={{ height: '50%' }}>
                      38 907
                    </div>
                  </div>

                  <div className={styles.popularityVersion}>
                    8.1.2
                    <Icon
                      kind='bugOutlined'
                      color='#212121'
                      className={styles.popularityVersionIcon}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* TODO: add Modules treemap here */}

            <div className={styles.stat}>
              <div className={styles.statHeader}>Used on</div>

              <SitesList sites={sites} className={styles.usedOnList} />
            </div>

            <div className={styles.actions}>
              <div className={styles.links}>
                <a href='#' className={styles.link} target='_blank' rel='noreferrer'>
                  <Icon kind='repository' color='#212121' className={styles.linkIcon} />
                  Repository
                </a>

                <a href='#' className={styles.link} target='_blank' rel='noreferrer'>
                  <Icon kind='link' color='#212121' className={styles.linkIcon} />
                  Homepage
                </a>

                <a href='#' className={styles.link} target='_blank' rel='noreferrer'>
                  <Icon
                    kind='npm'
                    width={32}
                    height={32}
                    color='#212121'
                    className={styles.linkIcon}
                  />
                </a>
              </div>

              <Button variant='arrow'>Details</Button>
            </div>
          </div>
        </div>
      </CSSTransition>

      <footer className={styles.footer}>
        <div className={styles.tags}>
          <a href='#' className={styles.tag}>
            #moment
          </a>
          <a href='#' className={styles.tag}>
            #date
          </a>
          <a href='#' className={styles.tag}>
            #time
          </a>
          <a href='#' className={styles.tag}>
            #parse
          </a>
          <a href='#' className={styles.tag}>
            #format
          </a>
          <Chip variant='info' size='medium' fontWeight={500}>
            +45
          </Chip>
        </div>

        <div className={styles.author}>
          <span className={styles.authorName}>jdalton</span>
          <img className={styles.authorImage} src='https://via.placeholder.com/36' alt='' />
        </div>
      </footer>
    </div>
  );
}
