import React, { useEffect, useState } from 'react';
import styles from './PackagePage.module.scss';
import modalStyles from '../../ui/Modal/Modal.module.scss';
import clsx from 'clsx';
import StickyDefaultHeader from '../../ui/Header/StickyDefaultHeader';
import Container from 'components/ui/Container/Container';
import { SitesListSkeleton } from '../../ui/SitesList/SitesListSkeleton';
import SitesList from '../../ui/SitesList/SitesList';
import { Icon } from '../../ui/Icon/Icon';
import ChipGroup from '../../ui/ChipGroup/ChipGroup';
import Chip from 'components/ui/Chip/Chip';
import { Button } from 'components/ui';
import Modal from '../../ui/Modal/Modal';
import SidebarCategorySort from 'components/ui/SidebarCategory/SidebarCategorySort';
import CardGroups from '../../ui/CardGroups/CardGroups';
import CardGroup from '../../ui/CardGroup/CardGroup';
import { CardListSkeleton } from '../../ui/CardList/CardListSkeleton';
import PackagesBySourceCardList from '../../ui/CardList/PackagesBySourceCardList';
import PopularPackageCardList from '../../ui/CardList/PopularPackageCardList';
import { packagesBySourceListData, popularPackageListData } from '../../../mocks/CardListsMocks';
import Footer from '../../ui/Footer/Footer';
import PackageVersion from '../../ui/PackageVersion/PackageVersion';
import Skeleton from '../../ui/Skeleton/Skeleton';
import { repeat } from 'utils/helpers';
import { loadedPackagePageData } from 'mocks/PackagePageMocks';
import AvatarGroup from '../../ui/AvatarGroup/AvatarGroup';
import Avatar from '../../ui/Avatar/Avatar';

type Props = {
  pageLoading?: boolean;
  packageName: string;
};

const PackagePage = ({ packageName, pageLoading = false }: Props) => {
  const [loading, setLoading] = useState(pageLoading);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortField, setSortField] = useState('versions');
  const [fullDescVisible, setFullDescVisible] = useState(false);
  const [modalSortOpen, setModalSortOpen] = useState(false);

  // FIXME: just for demo purpose
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  const sorts = ['weight', 'popularity', 'versions'];

  const {
    delta,
    currentVersion,
    lastUpdate,
    shortDesc,
    desc,
    fullDesc,
    usedOnList,
    vulnerabilities,
    dependencies,
    dependents,
    keywords,
    versions,
    homepageUrl,
    repositoryUrl,
    maintainers,
  } = loadedPackagePageData;

  const requestSort = (sortName: string) => {
    let direction = 'asc';

    if (sortDirection === 'asc' && sortName === sortField) {
      direction = 'desc';
    }

    setSortField(sortName);
    setSortDirection(direction);
  };

  const closeModalHandler = () => {
    setModalSortOpen(false);
  };

  return (
    <>
      <Modal isOpen={modalSortOpen} onClose={closeModalHandler}>
        <div className={modalStyles.modalContentWrapper}>
          <SidebarCategorySort categoryName='Sort by' returnButton={() => setModalSortOpen(false)}>
            <div className={styles.sortButtonsMobile}>
              {sorts.map((name) => (
                <button
                  key={name}
                  type='button'
                  className={clsx(
                    styles.sortButtonMobile,
                    sortField === name && styles.sortButtonMobileActive
                  )}
                  onClick={() => requestSort(name)}
                >
                  {name[0].toUpperCase() + name.slice(1)}

                  {/* TODO: not sure how to handle it better right now by using <Icon> component */}
                  {sortField === name && (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M11 14L7 18M7 18L3 14M7 18L7 8'
                        stroke={sortDirection === 'asc' ? '#212121' : '#DDDCE3'}
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M21 10L17 6M17 6L13 10M17 6L17 16'
                        stroke={sortDirection === 'desc' ? '#212121' : '#DDDCE3'}
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </SidebarCategorySort>
        </div>
      </Modal>

      <StickyDefaultHeader showSearch />

      <div className={styles.packagePage}>
        <Container>
          <div className={styles.packagePageGrid}>
            <div className={styles.content}>
              <h1>{packageName}</h1>

              <div className={styles.packageMeta}>
                {loading ? (
                  <Skeleton width={189} />
                ) : (
                  <>
                    <span className={styles.packageMetaItem}>{currentVersion}</span>
                    <span className={styles.packageMetaItem}>{lastUpdate}</span>
                  </>
                )}
              </div>

              <section className={styles.packageDescription}>
                <h2>Full description</h2>

                <div className={styles.packageDescriptionGrid}>
                  {loading ? (
                    <>
                      <div className={styles.packageDescriptionCol}>
                        <Skeleton className={styles.packageDescriptionColSkeletonFirst} />
                        <Skeleton className={styles.packageDescriptionColSkeletonSecond} />
                        <Skeleton className={styles.packageDescriptionColSkeletonThird} />
                      </div>
                      <div className={styles.packageDescriptionCol}>
                        <Skeleton className={styles.packageDescriptionColSkeletonFirst} />
                        <Skeleton className={styles.packageDescriptionColSkeletonSecond} />
                        <Skeleton className={styles.packageDescriptionColSkeletonThird} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.packageDescriptionCol}>
                        {fullDescVisible ? fullDesc : desc}
                      </div>
                    </>
                  )}
                </div>

                {!loading && !fullDescVisible && (
                  <button className={styles.link} onClick={() => setFullDescVisible(true)}>
                    Show all
                  </button>
                )}
              </section>

              <section>
                <h2>Used on</h2>

                {loading ? (
                  <SitesListSkeleton className={styles.usedOnList} />
                ) : (
                  <SitesList sites={usedOnList} className={styles.usedOnList} />
                )}
              </section>

              <section className={styles.versions}>
                <div className={styles.versionsTop}>
                  <h2 className={styles.versionsTitle}>Versions</h2>

                  <button
                    className={styles.mobileSort}
                    type='button'
                    onClick={() => setModalSortOpen(true)}
                    disabled={loading}
                  >
                    <Icon
                      kind='sort'
                      width={14}
                      height={14}
                      color={loading ? '#8E8AA0' : '#212121'}
                    />
                  </button>

                  <div className={styles.versionsActions}>
                    <span className={styles.versionsActionsTitle}>Sort by</span>
                    <span className={styles.sort}>
                      {/* TODO: move sort to separate entity/component */}
                      {sorts.map((name) => (
                        <Button
                          key={name}
                          variant='secondary'
                          size='medium'
                          className={clsx(
                            styles.sortButton,
                            sortField === name && styles.sortButtonActive
                          )}
                          onClick={() => requestSort(name)}
                          disabled={loading}
                        >
                          {name[0].toUpperCase() + name.slice(1)}

                          {!loading &&
                            (sortField === name ? (
                              <Icon
                                kind='arrowDown'
                                width={10}
                                height={12}
                                className={clsx(
                                  styles.sortIcon,
                                  sortDirection === 'desc' && styles.sortIconDesc
                                )}
                              />
                            ) : (
                              <Icon
                                kind='chevronDown'
                                width={10}
                                height={7}
                                className={styles.sortIcon}
                              />
                            ))}
                        </Button>
                      ))}
                    </span>
                  </div>
                </div>

                <div className={styles.packages}>
                  {loading
                    ? repeat(5, <Skeleton width='100%' height={100} variant='rounded' />)
                    : versions.map((version) => (
                        <PackageVersion
                          key={version.version}
                          version={version.version}
                          updateDate={version.updateDate}
                          uses={version.uses}
                          size={version.size}
                          sizeUnit={version.sizeUnit}
                          sizeUnitShorthand={version.sizeUnitShorthand}
                          modulesCount={version.modulesCount}
                          modules={version.modules}
                          entries={version.entries}
                        />
                      ))}
                </div>

                {!loading && <button className={styles.link}>Show +3 more</button>}
              </section>

              {/* TODO: there are no skeletons for vulnerabilities in design,
                        not sure if intended or overlooked */}
              {!loading && (
                <section>
                  <h2>Vulnerabilities</h2>

                  <div className={styles.vulnerabilities}>
                    {vulnerabilities.map(({ id, label, title, text, linkText, linkPath }) => (
                      <div key={id} className={styles.vulnerability}>
                        <div className={styles.vulnerabilityTop}>
                          <Chip
                            variant='vulnerabilities'
                            size='badge'
                            fontWeight='semiBold'
                            icon={
                              <Icon kind='vulnerability' width={24} height={24} color='white' />
                            }
                          >
                            {label}
                          </Chip>

                          <a
                            href={linkPath}
                            target='_blank'
                            rel='noreferrer'
                            className={styles.vulnerabilityLink}
                          >
                            {linkText}
                          </a>
                        </div>
                        <div className={styles.vulnerabilityTitle}>{title}</div>
                        <div className={styles.vulnerabilityText}>{text}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className={styles.sidebar}>
              <h4 className={styles.sidebarOptionalTitle}>Background information</h4>

              <div className={styles.sidebarInner}>
                <div className={styles.sidebarItem}>
                  {/* TODO: not sure if making this title hidden for desktop is intentional */}
                  <div className={clsx(styles.sidebarItemTitle, styles.sidebarItemTitleDesktop)}>
                    Links
                  </div>

                  <div className={styles.sidebarLinks}>
                    {loading ? (
                      <>
                        <Skeleton width={32} />
                        <span className={styles.sidebarLinkSkeleton}>
                          <Skeleton width={18} className={styles.sidebarLinkIconSkeleton} />
                          <Skeleton className={styles.sidebarLinkTextSkeleton} />
                        </span>
                        <span className={styles.sidebarLinkSkeleton}>
                          <Skeleton width={18} className={styles.sidebarLinkIconSkeleton} />
                          <Skeleton className={styles.sidebarLinkTextSkeleton} />
                        </span>
                      </>
                    ) : (
                      <>
                        <a
                          href={`https://www.npmjs.com/package/${packageName}`}
                          className={styles.externalLink}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Icon
                            kind='npm'
                            width={30}
                            height={13}
                            color='#8E8AA0'
                            className={styles.externalLinkIcon}
                          />
                        </a>

                        {repositoryUrl && (
                          <a
                            href={repositoryUrl}
                            className={styles.externalLink}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <Icon
                              kind='repository'
                              color='#8E8AA0'
                              className={styles.externalLinkIcon}
                            />
                            Repository
                          </a>
                        )}

                        {homepageUrl && (
                          <a
                            href={homepageUrl}
                            className={styles.externalLink}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <Icon kind='link' color='#8E8AA0' className={styles.externalLinkIcon} />
                            Homepage
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* TODO: probably hide about section on mobile with non-css solution */}
                <div className={clsx(styles.sidebarItem, styles.sidebarItemDesktop)}>
                  {loading ? (
                    <>
                      <div className={styles.sidebarItemTitle}>
                        <Skeleton width={49} />
                      </div>
                      <Skeleton width='90%' />
                      <Skeleton width='50%' />
                    </>
                  ) : (
                    <>
                      <div className={styles.sidebarItemTitle}>About</div>
                      <p className={styles.sidebarItemText}>{shortDesc}</p>
                      <button className={styles.link}>Go down to full description</button>
                    </>
                  )}
                </div>

                <div className={styles.sidebarItem}>
                  <div className={styles.stats}>
                    {loading ? (
                      repeat(
                        3,
                        <div className={styles.stat}>
                          <Skeleton
                            width={52}
                            height={52}
                            variant='circular'
                            className={styles.statImagePlaceholder}
                          />
                          <div className={styles.statContent}>
                            <span className={styles.statTitle}>
                              <Skeleton width={49} />
                            </span>
                            <span className={styles.statValue}>
                              <Skeleton width={108} />
                            </span>
                          </div>
                        </div>
                      )
                    ) : (
                      <>
                        {(maintainers?.length ?? 0) > 0 &&
                          (maintainers?.length === 1 ? (
                            <div className={styles.stat}>
                              <div className={styles.statImagePlaceholder}>
                                <img
                                  className={styles.statImage}
                                  src={maintainers[0].avatar}
                                  alt={maintainers[0].name}
                                />
                              </div>

                              <div className={styles.statContent}>
                                <span className={styles.statTitle}>Author</span>
                                <span className={styles.statValue}>{maintainers[0].name}</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className={styles.sidebarItemSubtitle}>Collaborators</div>
                              <div className={styles.sidebarCollaboratorsGroup}>
                                <AvatarGroup>
                                  {maintainers?.map((author) => (
                                    <Avatar
                                      alt={author.name}
                                      altAsTooltip={true}
                                      src={author.avatar}
                                    />
                                  ))}
                                </AvatarGroup>
                              </div>
                            </div>
                          ))}

                        <div className={styles.stat}>
                          <div className={styles.statImagePlaceholder}>
                            <Icon kind='license' width={20} height={20} />
                          </div>

                          <div className={styles.statContent}>
                            <span className={styles.statTitle}>Freely distributable</span>
                            <span className={styles.statValue}>MIT License</span>
                          </div>
                        </div>

                        <div className={styles.stat}>
                          <div className={styles.statImagePlaceholder}>
                            <Icon kind='rating' />
                          </div>

                          <div className={styles.statContent}>
                            <span className={styles.statTitle}>Rating</span>
                            <span className={styles.statValue}>
                              457{' '}
                              <span
                                className={clsx(
                                  delta > 0 ? styles.statRatingGreen : styles.statRatingRed
                                )}
                              >
                                {delta > 0 ? `+${delta}` : delta}
                              </span>
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarItem}>
                  <div className={styles.sidebarItemTitle}>{!loading && 4} Dependency</div>
                  <ChipGroup>
                    {loading
                      ? repeat(4, <Skeleton variant='rounded' width={108} height={36} />)
                      : dependencies.map((dependency) => (
                          <Chip key={dependency} font='monospace' size='medium' fontSize='small'>
                            {dependency}
                          </Chip>
                        ))}
                  </ChipGroup>
                </div>

                <div className={styles.sidebarItem}>
                  <div className={styles.sidebarItemTitle}>198 Dependents</div>

                  <ChipGroup>
                    {loading
                      ? repeat(6, <Skeleton variant='rounded' width={108} height={36} />)
                      : dependents.map((dependency) => (
                          <Chip key={dependency} font='monospace' size='medium' fontSize='small'>
                            {dependency}
                          </Chip>
                        ))}
                  </ChipGroup>

                  {!loading && (
                    <button className={clsx(styles.link, styles.sidebarItemAction)}>
                      View all
                    </button>
                  )}
                </div>

                <div className={styles.sidebarItem}>
                  <div className={styles.sidebarItemTitle}>Keywords</div>

                  <ChipGroup>
                    {loading
                      ? repeat(9, <Skeleton variant='rounded' width={89} height={36} />)
                      : keywords.map((keyword) => (
                          <Chip key={keyword} size='medium'>
                            {keyword}
                          </Chip>
                        ))}
                  </ChipGroup>
                </div>
              </div>
            </aside>
          </div>

          <CardGroups>
            <CardGroup title='Popular search queries'>
              {loading ? (
                <CardListSkeleton />
              ) : (
                <PackagesBySourceCardList cards={packagesBySourceListData} />
              )}
            </CardGroup>

            <CardGroup title='Popular packages'>
              {loading ? (
                <CardListSkeleton numberOfElements={6} />
              ) : (
                <PopularPackageCardList cards={popularPackageListData} />
              )}
            </CardGroup>
          </CardGroups>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default PackagePage;
