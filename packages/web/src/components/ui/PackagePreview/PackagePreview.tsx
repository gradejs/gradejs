import React, { useState } from 'react';
import Skeleton from '../Skeleton/Skeleton';
import styles from './PackagePreview.module.scss';
import { Icon } from '../Icon/Icon';
import Chip from '../Chip/Chip';
import clsx from 'clsx';
import ChipGroup from '../ChipGroup/ChipGroup';
import SitesList, { Site } from '../SitesList/SitesList';
import { CSSTransition } from 'react-transition-group';
import Button from '../Button/Button';
import { formatNumber } from '../../../utils/helpers';

type Props = {
  name: string;
  version: string;
  opened?: boolean;
  loading?: boolean;
  detailsLoading?: boolean;
};

export default function PackagePreview({
  name,
  version,
  opened,
  loading = false,
  detailsLoading = false,
}: Props) {
  const [open, setOpen] = useState<boolean>(opened ?? false);
  const [packageDetailsLoading, setPackageDetailsLoading] = useState<boolean>(detailsLoading);

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

  // TODO: mock data, remove later
  const modules = [
    {
      fill: '100%',
      uses: 89912,
      moduleVersion: '21.3.0',
    },
    {
      fill: '90%',
      uses: 67111,
      moduleVersion: '18.2.0',
    },
    {
      fill: '80%',
      uses: 44212,
      moduleVersion: '20.1.0',
    },
    {
      fill: '70%',
      uses: 41129,
      moduleVersion: '18.0.0',
    },
    {
      fill: '60%',
      uses: 40465,
      moduleVersion: '19.11.2',
    },
    {
      fill: '50%',
      uses: 38907,
      moduleVersion: '8.1.2',
      bug: true,
    },
  ];

  const toggleOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
      setPackageDetailsLoading(true);

      // FIXME: just for demo purposes
      setTimeout(() => setPackageDetailsLoading(false), 4000);
    }
  };

  // TODO: add arrow button inside skeleton
  if (loading) {
    return <Skeleton className={styles.packageSkeleton} />;
  }

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
              {packageDetailsLoading ? (
                <Skeleton>
                  <a href='#' className={styles.statLink} target='_blank' rel='noreferrer'>
                    /rsrc.php/v3id044/yu/l/en_US/yD2XaVkWQHO.js?_nc_x=Ij3Wp8lg5Kz
                  </a>
                </Skeleton>
              ) : (
                <a href='#' className={styles.statLink} target='_blank' rel='noreferrer'>
                  /rsrc.php/v3id044/yu/l/en_US/yD2XaVkWQHO.js?_nc_x=Ij3Wp8lg5Kz
                </a>
              )}
            </div>

            <div className={styles.statList}>
              <div className={clsx(styles.stat, styles.statListItemSmall)}>
                <div className={styles.statHeader}>
                  <Icon kind='license' color='#8E8AA0' className={styles.statIcon} />
                  License
                </div>
                {packageDetailsLoading ? (
                  <>
                    <Skeleton>
                      <div className={styles.statTitle}>MIT license</div>
                    </Skeleton>
                    <Skeleton>
                      <div className={styles.statSubtitle}>freely distributable</div>
                    </Skeleton>
                  </>
                ) : (
                  <>
                    <div className={styles.statTitle}>MIT license</div>
                    <div className={styles.statSubtitle}>freely distributable</div>
                  </>
                )}
              </div>

              <div className={clsx(styles.stat, styles.statListItemSmall)}>
                <div className={styles.statHeader}>
                  <Icon kind='rating' color='#8E8AA0' className={styles.statIcon} />
                  Rating
                </div>
                {packageDetailsLoading ? (
                  <>
                    <Skeleton>
                      <div className={styles.statTitle}>385</div>
                    </Skeleton>
                    <Skeleton>
                      <div className={styles.statSubtitle}>out of 12 842</div>
                    </Skeleton>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className={clsx(styles.stat, styles.statListItemLarge)}>
                <div className={styles.statHeader}>
                  <Icon kind='dependency' color='#8E8AA0' className={styles.statIcon} />
                  {!packageDetailsLoading && 4} Dependency
                </div>
                <ChipGroup
                  chips={['art', 'create-react-class', 'loose-envify', 'scheduler']}
                  fontSize='small'
                  loading={packageDetailsLoading}
                />
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='graph' color='#8E8AA0' className={styles.statIcon} />
                Versions popularity by uses on sites
              </div>

              <div className={styles.popularity}>
                {modules.map(({ fill, uses, moduleVersion, bug }) => (
                  <div className={styles.popularityItemWrapper}>
                    <div className={styles.popularityItem}>
                      {packageDetailsLoading ? (
                        <div
                          className={clsx(styles.popularityFill, styles.popularityFillSkeleton)}
                          style={{ height: fill }}
                        >
                          <Skeleton
                            width='100%'
                            height='100%'
                            className={styles.popularitySkeleton}
                          >
                            {formatNumber(uses)}
                          </Skeleton>
                        </div>
                      ) : (
                        <div className={styles.popularityFill} style={{ height: fill }}>
                          {formatNumber(uses)}
                        </div>
                      )}
                    </div>

                    {packageDetailsLoading ? (
                      <Skeleton className={styles.popularityVersionSkeleton}>
                        <div className={styles.popularityVersion}>{moduleVersion}</div>
                      </Skeleton>
                    ) : (
                      <div className={styles.popularityVersion}>
                        {moduleVersion}
                        {bug && (
                          <Icon
                            kind='bugOutlined'
                            color='#212121'
                            className={styles.popularityVersionIcon}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* TODO: add Modules treemap here */}

            <div className={styles.stat}>
              <div className={styles.statHeader}>Used on</div>

              <SitesList
                sites={sites}
                className={styles.usedOnList}
                loading={packageDetailsLoading}
              />
            </div>

            <div className={styles.actions}>
              <div className={styles.links}>
                {packageDetailsLoading ? (
                  <>
                    <div className={styles.link}>
                      <Skeleton width={18} height={18} className={styles.linkIcon} />
                      <Skeleton>Repository</Skeleton>
                    </div>

                    <div className={styles.link}>
                      <Skeleton width={18} height={18} className={styles.linkIcon} />
                      <Skeleton>Repository</Skeleton>
                    </div>

                    <div className={styles.link}>
                      <Skeleton width={18} height={18} className={styles.linkIcon} />
                      <Skeleton>Repository</Skeleton>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
          <Chip variant='info' size='medium' fontWeight='semiBold'>
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
