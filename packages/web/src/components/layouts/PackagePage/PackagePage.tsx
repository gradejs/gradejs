import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './PackagePage.module.scss';
import modalStyles from '../../ui/Modal/Modal.module.scss';
import clsx from 'clsx';
import StickyDefaultHeader from '../../ui/Header/StickyDefaultHeader';
import Container from 'components/ui/Container/Container';
import { Icon } from '../../ui/Icon/Icon';
import ChipGroup from '../../ui/ChipGroup/ChipGroup';
import Chip from 'components/ui/Chip/Chip';
import { Button } from 'components/ui';
import Modal from '../../ui/Modal/Modal';
import SidebarCategorySort from 'components/ui/SidebarCategory/SidebarCategorySort';
import Footer from '../../ui/Footer/Footer';
import PackageVersionDetailsBlock from '../../ui/PackageVersionDetailsBlock/PackageVersionDetailsBlock';
import Skeleton from '../../ui/Skeleton/Skeleton';
import { capitalizeWord, plural, repeat } from 'utils/helpers';
import AvatarGroup from '../../ui/AvatarGroup/AvatarGroup';
import Avatar from '../../ui/Avatar/Avatar';
import { GetPackageInfoOutput } from '../../../services/apiClient';
import { SitesListSkeleton } from '../../ui/SitesList/SitesListSkeleton';
import SitesList from '../../ui/SitesList/SitesList';
import semver from 'semver';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';
import VersionPopularityChartSkeleton from 'components/ui/VersionPopularityChart/VersionPopularityChartSkeleton';
import VersionPopularityChart from 'components/ui/VersionPopularityChart/VersionPopularityChart';
import ShowcaseContainer from 'components/containers/ShowcaseContainer';
import { USAGE_CHUNK_LIMIT } from 'store/hooks/usePackageInfo';

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

type Props = {
  loading?: boolean;
  usageLoading?: boolean;
  packageInfo?: GetPackageInfoOutput;
  onUsageMoreClick?: () => unknown;
};

// Clean commonly used tags inside markdown
function mdclean(markdown = ''): string {
  return markdown.replace(/<br\/?\s?>/g, '\n');
}

const PackagePage = ({ packageInfo, usageLoading, onUsageMoreClick, loading = false }: Props) => {
  const [sortDirection, setSortDirection] = useState('desc' as 'asc' | 'desc');
  const [sortField, setSortField] = useState('versions');
  const [fullDescVisible, setFullDescVisible] = useState(false);
  const [allVersionsVisible, setAllVersionsVisible] = useState(false);
  const [modalSortOpen, setModalSortOpen] = useState(false);

  const sorts = useMemo(() => ['size', 'usage', 'version'], []);

  const {
    name: packageName,
    vulnerabilities,
    fullDescription,
    description,
    latestVersion,
    maintainers,
    deps,
    keywords,
    versionSpecificValues,
    homepageUrl,
    repositoryUrl,
    license,
    usage,
    updateDate,
    usageByHostnameCount,
  } = packageInfo ?? {};

  const requestSort = (sortName: string) => {
    if (sortName !== sortField) {
      setSortDirection('desc');
    } else {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
    setSortField(sortName);
  };

  const closeModalHandler = () => {
    setModalSortOpen(false);
  };

  const formattedVulnerabilities = useMemo(
    () =>
      vulnerabilities?.map((v) => ({
        id: v.id,
        severity: (v.osvData?.database_specific as any | undefined)?.severity, // TODO: proper typing
        linkPath: `https://github.com/advisories/${v.osvId}`,
        linkText: v.osvId,
        title: v.osvData?.summary,
        fixedAfter: v.packageVersionRange, // TODO: fair last version
      })),
    [vulnerabilities]
  );

  const imageUriTransformer = (input: string) =>
    input.startsWith('https://')
      ? input
      : packageInfo?.repositoryUrl?.startsWith('https://github.com')
      ? `https://raw.githubusercontent.com/${packageInfo?.repositoryUrl?.replace(
          /^https:\/\/github.com\//,
          ''
        )}/HEAD/${input}`
      : input;

  const formattedVersions = useMemo(
    () =>
      Object.entries(versionSpecificValues ?? {})
        .map(([version, data]) => ({
          version,
          updateDate: data.updateDate,
          uses: data.uses,
          size: data.unpackedSize,
          isVulnerable: vulnerabilities?.some((v) =>
            semver.satisfies(version, v.packageVersionRange)
          ),
          modulesCount: data.registryModulesCount, // TODO: detected modules count?
          modules: [], // TODO
          entries: [], // TODO
        }))
        .sort((b, a) => {
          let sort: number;
          switch (sortField) {
            case 'size':
              sort = (b.size ?? 0) - (a.size ?? 0);
              break;
            case 'usage':
              sort = (b.uses ?? 0) - (a.uses ?? 0);
              break;
            case 'version':
            default:
              sort = semver.compare(b.version, a.version);
          }
          return sortDirection === 'desc' ? -1 * sort : sort;
        }),
    [versionSpecificValues, vulnerabilities, sortDirection, sortField]
  );

  const usageMoreNextChunk = useMemo(() => {
    if (packageInfo && packageInfo.usageByHostnameCount) {
      return Math.min(
        USAGE_CHUNK_LIMIT,
        packageInfo.usageByHostnameCount - packageInfo.usage.length
      );
    }

    return 0;
  }, [packageInfo]);

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
                  {capitalizeWord(name)}
                  {sortField === name && (
                    <Icon
                      kind={sortDirection === 'desc' ? 'sortDesc' : 'sortAsc'}
                      width={24}
                      height={24}
                    />
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
              {/* TODO: insert <wbr> after '/' in namespaces */}
              <h1 className={styles.packageName}>{packageName}</h1>

              <div className={styles.packageMeta}>
                {loading ? (
                  <Skeleton width={189} />
                ) : (
                  <>
                    <span className={styles.packageMetaItem}>{latestVersion}</span>
                    {updateDate && (
                      <span className={styles.packageMetaItem}>
                        Last updated on {dateTimeFormatter.format(new Date(updateDate ?? ''))}
                      </span>
                    )}
                  </>
                )}
              </div>

              <section className={styles.packageDescription}>
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
                      <div
                        className={clsx(
                          styles.packageDescriptionCol,
                          fullDescVisible ? styles.markdown : null
                        )}
                      >
                        {fullDescVisible ? (
                          <ReactMarkdown
                            transformImageUri={imageUriTransformer}
                            components={{
                              h1: 'h2',
                              source({ srcSet, ...props }) {
                                return (
                                  <source {...props} srcSet={imageUriTransformer(srcSet ?? '')} />
                                );
                              },
                              code({ inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className ?? '');
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={prism}
                                    language={match[1]}
                                    PreTag='div'
                                    {...props}
                                  />
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                            rehypePlugins={[
                              rehypeRaw /* TODO: this is unsafe in general. Do we trust markdown coming from npm? */,
                            ]}
                            linkTarget='_blank'
                          >
                            {mdclean(fullDescription) ?? ''}
                          </ReactMarkdown>
                        ) : (
                          description
                        )}
                      </div>
                    </>
                  )}
                </div>

                {!loading && !fullDescVisible && (
                  <button className={styles.link} onClick={() => setFullDescVisible(true)}>
                    Show full description
                  </button>
                )}
              </section>

              {loading && (
                <section className={styles.usedOn}>
                  <h2>Used on</h2>

                  <SitesListSkeleton className={styles.usedOnList} />
                </section>
              )}

              {!!usage?.length && (
                <section className={styles.usedOn}>
                  <h2>Used on {usageByHostnameCount} websites</h2>
                  <SitesList sites={usage} className={styles.usedOnList} />

                  <div className={styles.showMorePackages}>
                    {usageLoading ? (
                      <button className={styles.link}>Loading...</button>
                    ) : (
                      usageMoreNextChunk > 0 && (
                        <button className={styles.link} onClick={onUsageMoreClick}>
                          Show +{usageMoreNextChunk} more
                        </button>
                      )
                    )}
                  </div>
                </section>
              )}

              <section className={styles.mostPopularVersions}>
                <h2>Top usage distribution</h2>

                {loading ? (
                  <VersionPopularityChartSkeleton />
                ) : (
                  <VersionPopularityChart
                    max={8}
                    versionSpecificValues={versionSpecificValues ?? {}}
                  />
                )}
              </section>

              {/* TODO: there are no skeletons for vulnerabilities in design,
                        not sure if intended or overlooked */}
              {!loading && !!formattedVulnerabilities?.length && (
                <section>
                  <h2>Vulnerabilities</h2>

                  <div className={styles.vulnerabilities}>
                    {formattedVulnerabilities?.map(
                      ({ id, severity, linkPath, linkText, title, fixedAfter }) => (
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
                              {severity}
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
                          <div className={styles.vulnerabilityText}>{fixedAfter}</div>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

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
                          {capitalizeWord(name)}

                          {!loading &&
                            (sortField === name ? (
                              <Icon
                                kind='arrowDown'
                                width={10}
                                height={12}
                                className={clsx(
                                  styles.sortIcon,
                                  sortDirection === 'asc' && styles.sortIconAsc
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
                    : (allVersionsVisible ? formattedVersions : formattedVersions.slice(0, 5)).map(
                        (version) => (
                          <PackageVersionDetailsBlock
                            key={version.version}
                            version={version.version}
                            updateDate={
                              version.updateDate &&
                              dateTimeFormatter.format(new Date(version.updateDate))
                            }
                            uses={version.uses}
                            size={version.size}
                            modulesCount={version.modulesCount}
                            isVulnerable={version.isVulnerable}
                          />
                        )
                      )}
                </div>

                {!loading && formattedVersions.length > 5 && !allVersionsVisible && (
                  <button className={styles.link} onClick={() => setAllVersionsVisible(true)}>
                    Show +{formattedVersions.length - 5} more
                  </button>
                )}
              </section>
            </div>

            <aside className={styles.sidebar}>
              <h4 className={styles.sidebarOptionalTitle}>Summary</h4>

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
                                <AvatarGroup max={8}>
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
                            <Icon kind='modules' width={20} height={20} />
                          </div>

                          <div className={styles.statContent}>
                            <span className={styles.statTitle}>Used on</span>
                            <span className={styles.statValue}>
                              {plural(usageByHostnameCount ?? 0, 'website', 'websites')}
                            </span>
                          </div>
                        </div>

                        <div className={styles.stat}>
                          <div className={styles.statImagePlaceholder}>
                            <Icon kind='license' width={20} height={20} />
                          </div>

                          <div className={styles.statContent}>
                            <span className={styles.statTitle}>License</span>
                            <span className={styles.statValue}>{license}</span>
                          </div>
                        </div>

                        {/*<div className={styles.stat}>*/}
                        {/*  <div className={styles.statImagePlaceholder}>*/}
                        {/*    <Icon kind='rating' />*/}
                        {/*  </div>*/}

                        {/*  <div className={styles.statContent}>*/}
                        {/*    <span className={styles.statTitle}>Rating</span>*/}
                        {/*    <span className={styles.statValue}>*/}
                        {/*      457{' '}*/}
                        {/*      <span*/}
                        {/*        className={clsx(*/}
                        {/*          delta > 0 ? styles.statRatingGreen : styles.statRatingRed*/}
                        {/*        )}*/}
                        {/*      >*/}
                        {/*        {delta > 0 ? `+${delta}` : delta}*/}
                        {/*      </span>*/}
                        {/*    </span>*/}
                        {/*  </div>*/}
                        {/*</div>*/}
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarItem}>
                  <div className={styles.sidebarItemTitle}>
                    {!loading && plural(deps?.length ?? 0, 'Dependency', 'Dependencies')}
                  </div>
                  {!!deps?.length && (
                    <ChipGroup>
                      {loading
                        ? repeat(4, <Skeleton variant='rounded' width={108} height={36} />)
                        : deps.map((dependency) => (
                            <Link key={dependency} to={`/package/${dependency}`}>
                              <Chip font='monospace'>{dependency}</Chip>
                            </Link>
                          ))}
                    </ChipGroup>
                  )}
                </div>

                {/*<div className={styles.sidebarItem}>*/}
                {/*  <div className={styles.sidebarItemTitle}>198 Dependents</div>*/}

                {/*  <ChipGroup>*/}
                {/*    {loading*/}
                {/*      ? repeat(6, <Skeleton variant='rounded' width={108} height={36} />)*/}
                {/*      : dependents.map((dependency) => (*/}
                {/*          <Chip key={dependency} font='monospace' size='medium' fontSize='small'>*/}
                {/*            {dependency}*/}
                {/*          </Chip>*/}
                {/*        ))}*/}
                {/*  </ChipGroup>*/}

                {/*  {!loading && (*/}
                {/*    <button className={clsx(styles.link, styles.sidebarItemAction)}>*/}
                {/*      View all*/}
                {/*    </button>*/}
                {/*  )}*/}
                {/*</div>*/}

                <div className={styles.sidebarItem}>
                  <div className={styles.sidebarItemTitle}>Keywords</div>

                  <ChipGroup>
                    {loading
                      ? repeat(9, <Skeleton variant='rounded' width={89} height={36} />)
                      : keywords?.map((keyword) => (
                          <Chip key={keyword} size='medium'>
                            {keyword}
                          </Chip>
                        ))}
                  </ChipGroup>
                </div>
              </div>
            </aside>
          </div>

          <ShowcaseContainer showVulnerableWebsites={false} />
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default PackagePage;
