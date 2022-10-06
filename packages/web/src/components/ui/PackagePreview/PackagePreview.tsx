import React from 'react';
import styles from './PackagePreview.module.scss';
import { Icon } from '../Icon/Icon';
import Chip from '../Chip/Chip';
import clsx from 'clsx';
import ChipGroup from '../ChipGroup/ChipGroup';
import { CSSTransition } from 'react-transition-group';
import {
  FootprintSkeleton,
  LicenceSkeleton,
  LinksSkeleton,
  ScriptSkeleton,
} from './PackagePreviewSkeleton';
import ProblemBadge from '../ProblemBadge/ProblemBadge';
import { ChipGroupSkeleton } from '../ChipGroup/ChipGroupSkeleton';
import { IdentifiedPackage } from 'store/selectors/websiteResults';
import AvatarGroup from '../AvatarGroup/AvatarGroup';
import Avatar from '../Avatar/Avatar';
import Vulnerabilities from '../Vulnerabilities/Vulnerabilities';
import { getReadableSizeString, plural } from '../../../utils/helpers';
import AvatarSites from '../AvatarSites/AvatarSites';

type Props = {
  opened?: boolean;
  detailsLoading?: boolean;
  // sites: Site[];
  pkg: IdentifiedPackage;
};

function makeNpmUrl(pkg: IdentifiedPackage) {
  return `https://www.npmjs.com/package/${pkg.name}`;
}

// TODO: refactor this (decomposition, props, memoization, etc)
export default function PackagePreview({
  opened,
  //sites,
  pkg,
  detailsLoading = false,
}: Props) {
  // const navigate = useNavigate();

  // const toggleOpen = () => {
  //   setOpen(!open);
  // };

  const vulnerabilities = pkg.vulnerabilities;
  const versions = Object.keys(pkg.registryMetadata?.versionSpecificValues ?? {});
  const deps = Object.keys(
    pkg.registryMetadata?.versionSpecificValues?.[versions[versions.length - 1]]?.dependencies ?? {}
  );

  return (
    <div className={clsx(styles.package, opened && styles.open)}>
      <div className={styles.header}>
        <div className={styles.top} /* onClick={toggleOpen}*/>
          <div className={styles.title}>
            <span className={styles.name}>
              {pkg.name} <span className={styles.version}>{pkg.version}</span>
            </span>

            {(pkg.vulnerable || pkg.outdated || pkg.duplicate) && (
              <span className={styles.problems}>
                {pkg.vulnerable && <ProblemBadge problem='vulnerabilities' />}
                {pkg.outdated && <ProblemBadge problem='outdated' />}
                {/*pkg.duplicate && <ProblemBadge problem='duplicate' />*/}
              </span>
            )}
          </div>
          {/*
          <button type='button' className={styles.arrowWrapper} onClick={toggleOpen}>
            <Icon kind='arrowDown' width={14} height={8} color='#8E8AA0' className={styles.arrow} />
          </button>
          */}
        </div>

        {/* TODO: where to put fullDescription? */}
        {pkg.registryMetadata?.description && (
          <div className={styles.desc}>{pkg.registryMetadata?.description}</div>
        )}

        {pkg.hostsFaviconList && (
          <div className={styles.avatarSites}>
            <AvatarSites
              max={6}
              hostsFaviconList={pkg.hostsFaviconList}
              totalUsageCount={pkg.totalUsageCount}
            />
          </div>
        )}
      </div>

      <CSSTransition
        in={opened}
        timeout={600}
        classNames={{
          enterDone: styles.contentEnterDone,
        }}
      >
        <div className={styles.content}>
          <div className={styles.contentInner}>
            {!!pkg.containingScripts?.length && (
              <div className={styles.stat}>
                <div className={styles.statHeader}>
                  <Icon kind='script' color='#8E8AA0' className={styles.statIcon} />
                  Script
                </div>
                {detailsLoading ? (
                  <ScriptSkeleton />
                ) : (
                  pkg.containingScripts?.map((containingScript, index) => (
                    <a
                      key={index}
                      href={containingScript}
                      className={styles.statLink}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {containingScript}
                    </a>
                  ))
                )}
              </div>
            )}

            {(pkg.registryMetadata?.license || deps.length > 0) && (
              <div className={styles.statList}>
                {pkg.registryMetadata?.license && (
                  <div className={clsx(styles.stat, styles.statListItemSmall)}>
                    <div className={styles.statHeader}>
                      <Icon kind='license' color='#8E8AA0' className={styles.statIcon} />
                      License
                    </div>
                    {detailsLoading ? (
                      <LicenceSkeleton />
                    ) : (
                      <>
                        {/* TODO: license may be a big string! How we deal with it?*/}
                        <div className={styles.statTitle}>{pkg.registryMetadata?.license}</div>
                        {/* TODO
                    <div className={styles.statSubtitle}>
                      {pkg.registryMetadata?.licenseDescription}
                    </div>*/}
                      </>
                    )}
                  </div>
                )}

                {!!pkg.approximateByteSize && (
                  <div className={clsx(styles.stat, styles.statListItemSmall)}>
                    <div className={styles.statHeader}>
                      <Icon kind='weight' color='#8E8AA0' className={styles.statIcon} />
                      Footprint
                    </div>
                    {detailsLoading ? (
                      <FootprintSkeleton />
                    ) : (
                      <div className={styles.statTitle}>
                        {getReadableSizeString(pkg.approximateByteSize)}
                      </div>
                    )}
                  </div>
                )}

                {/*
              <div className={clsx(styles.stat, styles.statListItemSmall)}>
                <div className={styles.statHeader}>
                  <Icon kind='rating' color='#8E8AA0' className={styles.statIcon} />
                  Rating
                  <span className={styles.statTooltip}>
                    <Hint text='Rating based on our service' />
                  </span>
                </div>
                {detailsLoading ? (
                  <RatingSkeleton />
                ) : (
                  <>
                    <div className={styles.statTitle}>
                      {pkg.rating}
                      <div
                        className={clsx(
                          styles.statRating,
                          pkg.ratingDelta > 0 ? styles.statRatingGreen : styles.statRatingRed
                        )}
                      >
                        <Icon
                          kind='ratingArrow'
                          width={12}
                          height={12}
                          className={styles.statRatingArrow}
                        />
                        {pkg.ratingDelta}
                      </div>
                    </div>
                    <div className={styles.statSubtitle}>
                      out of {formatNumber(totalRatedPackages)}
                    </div>
                  </>
                )}
              </div>
              */}

                {deps.length > 0 && (
                  <div className={clsx(styles.stat, styles.statListItemLarge)}>
                    <div className={styles.statHeader}>
                      <Icon kind='dependency' color='#8E8AA0' className={styles.statIcon} />
                      {plural(deps.length, 'dependency', 'dependencies')}
                    </div>

                    {detailsLoading ? (
                      <ChipGroupSkeleton />
                    ) : (
                      <ChipGroup>
                        {deps.map((dependency) => (
                          <Chip
                            key={dependency}
                            title={dependency}
                            size='medium'
                            fontSize='small'
                            font='monospace'
                          >
                            {dependency}
                          </Chip>
                        ))}
                      </ChipGroup>
                    )}
                  </div>
                )}
              </div>
            )}

            {!!vulnerabilities?.length && (
              <div className={clsx(styles.stat, styles.statListItemNewLine)}>
                <div className={styles.statHeader}>
                  <Icon kind='vulnerability' color='#8E8AA0' className={styles.statIcon} />
                  Vulnerabilities
                </div>
                <Vulnerabilities vulnerabilities={vulnerabilities} />
              </div>
            )}

            {/* TODO: separate component
            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='graph' color='#8E8AA0' className={styles.statIcon} />
                Versions popularity by uses on sites
              </div>

              <div className={styles.popularity}>
                {detailsLoading ? <BarChartSkeleton /> : <BarChart bars={packages} />}
              </div>
            </div>
            */}

            {/* TODO: add Modules treemap here */}

            {/*
              <div className={styles.stat}>
                <div className={styles.statHeader}>Used on</div>

                {detailsLoading ? (
                  <SitesListSkeleton className={styles.usedOnList} />
                ) : (
                  <SitesList sites={sites} className={styles.usedOnList} />
                )}
              </div>
              */}
            <div className={styles.actions}>
              <div className={styles.links}>
                {detailsLoading ? (
                  <LinksSkeleton />
                ) : (
                  <>
                    {pkg.registryMetadata?.repositoryUrl && (
                      <a
                        href={pkg.registryMetadata?.repositoryUrl}
                        className={styles.link}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Icon kind='repository' color='#212121' className={styles.linkIcon} />
                        Repository
                      </a>
                    )}

                    {pkg.registryMetadata?.homepageUrl && (
                      <a
                        href={pkg.registryMetadata?.homepageUrl}
                        className={styles.link}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Icon kind='link' color='#212121' className={styles.linkIcon} />
                        Homepage
                      </a>
                    )}

                    <a
                      href={makeNpmUrl(pkg)}
                      className={styles.link}
                      target='_blank'
                      rel='noreferrer'
                    >
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

              {/* TODO: should be a <a> link w/ router support */}
              {/*
              <Button variant='arrow' onClick={() => navigate(`/package/${pkg.name}`)}>
                Details
              </Button>
              */}
            </div>
          </div>
        </div>
      </CSSTransition>

      {(pkg.registryMetadata?.keywords || pkg.registryMetadata?.maintainers) && (
        <div className={styles.footer}>
          <div className={styles.tags}>
            {/* TODO: not sure how to conditionally render maximum number of keywords (e.g. 5 for
                    desktop, 3/4 for tablet, 2 for mobile) based on viewport and update rest number
                    of keywords beyond current maximum in Chip */}
            {/* ^ Nearly impossible thing for responsive markup rendered on server.
                Maybe just avoid conditional render? // oklimenko */}
            {pkg.registryMetadata?.keywords?.slice(0, 5).map((tag) => (
              <a href='#' className={styles.tag}>
                {tag}
              </a>
            ))}
            {(pkg.registryMetadata?.keywords?.length ?? 0) > 5 && (
              <Chip variant='info' size='medium' fontWeight='semiBold'>
                +{(pkg.registryMetadata?.keywords?.length ?? 0) - 5}
              </Chip>
            )}
          </div>

          {(pkg.registryMetadata?.maintainers?.length ?? 0) > 0 && (
            <div className={styles.author}>
              {pkg.registryMetadata?.maintainers?.length === 1 ? (
                <>
                  <span className={styles.authorName}>
                    {pkg.registryMetadata.maintainers[0].name}
                  </span>
                  <span className={styles.authorImage}>
                    <Avatar
                      alt={pkg.registryMetadata.maintainers[0].name}
                      src={pkg.registryMetadata.maintainers[0].avatar}
                    />
                  </span>
                </>
              ) : (
                <AvatarGroup>
                  {pkg.registryMetadata?.maintainers?.map((author) => (
                    <Avatar alt={author.name} altAsTooltip={true} src={author.avatar} />
                  ))}
                </AvatarGroup>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
