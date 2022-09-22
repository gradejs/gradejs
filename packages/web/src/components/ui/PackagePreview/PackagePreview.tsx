import React, { useState } from 'react';
import styles from './PackagePreview.module.scss';
import { Icon } from '../Icon/Icon';
import Chip from '../Chip/Chip';
import clsx from 'clsx';
import ChipGroup from '../ChipGroup/ChipGroup';
import { CSSTransition } from 'react-transition-group';
import Button from '../Button/Button';
import { LicenceSkeleton, LinksSkeleton } from './PackagePreviewSkeleton';
import ProblemBadge from '../ProblemBadge/ProblemBadge';
import { ChipGroupSkeleton } from '../ChipGroup/ChipGroupSkeleton';
import { useNavigate } from 'react-router-dom';
import { IdentifiedPackage } from 'store/selectors/websiteResults';

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
  const [open, setOpen] = useState<boolean>(opened ?? false);
  const [packageDetailsLoading, setPackageDetailsLoading] = useState<boolean>(detailsLoading);
  const navigate = useNavigate();

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

  const deps = Object.keys(
    pkg.registryMetadata?.versionSpecificValues?.[pkg.versionSet[pkg.versionSet.length - 1]]
      .dependencies ?? {}
  );

  return (
    <div className={clsx(styles.package, open && styles.open)}>
      <div className={styles.header}>
        <div className={styles.top} onClick={toggleOpen}>
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

          <button type='button' className={styles.arrowWrapper} onClick={toggleOpen}>
            <Icon
              kind='arrowDown'
              style={{ transform: opened ? 'rotate(180deg)' : 'rotate(0)' }}
              width={14}
              height={8}
              color='#8E8AA0'
              className={styles.arrow}
            />
          </button>
        </div>

        <div className={styles.desc}>{pkg.registryMetadata?.fullDescription}</div>
      </div>

      <CSSTransition
        in={open}
        timeout={600}
        classNames={{
          enterDone: styles.contentEnterDone,
        }}
      >
        <div className={styles.content}>
          <div className={styles.contentInner}>
            {/*
            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='script' color='#8E8AA0' className={styles.statIcon} />
                Script
              </div>
              {packageDetailsLoading ? (
                <ScriptSkeleton />
              ) : (
                <a
                  href={pkg.containingScriptUrl}
                  className={styles.statLink}
                  target='_blank'
                  rel='noreferrer'
                >
                  {pkg.containingScriptUrl}
                </a>
              )}
            </div>
            */}

            <div className={styles.statList}>
              <div className={clsx(styles.stat, styles.statListItemSmall)}>
                <div className={styles.statHeader}>
                  <Icon kind='license' color='#8E8AA0' className={styles.statIcon} />
                  License
                </div>
                {packageDetailsLoading ? (
                  <LicenceSkeleton />
                ) : (
                  <>
                    <div className={styles.statTitle}>{pkg.registryMetadata?.license}</div>
                    {/* TODO
                    <div className={styles.statSubtitle}>
                      {pkg.registryMetadata?.licenseDescription}
                    </div>*/}
                  </>
                )}
              </div>

              {/*
              <div className={clsx(styles.stat, styles.statListItemSmall)}>
                <div className={styles.statHeader}>
                  <Icon kind='rating' color='#8E8AA0' className={styles.statIcon} />
                  Rating
                  <span className={styles.statTooltip}>
                    <Hint text='Rating based on our service' />
                  </span>
                </div>
                {packageDetailsLoading ? (
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

              <div className={clsx(styles.stat, styles.statListItemLarge)}>
                <div className={styles.statHeader}>
                  <Icon kind='dependency' color='#8E8AA0' className={styles.statIcon} />
                  Dependencies
                  {packageDetailsLoading ? (
                    <ChipGroupSkeleton />
                  ) : (
                    <ChipGroup>
                      {deps.map((dependency) => (
                        <Chip size='medium' fontSize='small' font='monospace'>
                          {dependency}
                        </Chip>
                      ))}
                    </ChipGroup>
                  )}
                </div>
              </div>

              {/* TODO: separate component
            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='graph' color='#8E8AA0' className={styles.statIcon} />
                Versions popularity by uses on sites
              </div>

              <div className={styles.popularity}>
                {packageDetailsLoading ? <BarChartSkeleton /> : <BarChart bars={packages} />}
              </div>
            </div>
            */}

              {/* TODO: add Modules treemap here */}

              {/*
              <div className={styles.stat}>
                <div className={styles.statHeader}>Used on</div>

                {packageDetailsLoading ? (
                  <SitesListSkeleton className={styles.usedOnList} />
                ) : (
                  <SitesList sites={sites} className={styles.usedOnList} />
                )}
              </div>
              */}

              <div className={styles.actions}>
                <div className={styles.links}>
                  {packageDetailsLoading ? (
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
                <Button variant='arrow' onClick={() => navigate(`/package/${pkg.name}`)}>
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {/* TODO: not sure how to conditionally render maximum number of keywords (e.g. 5 for
                    desktop, 3/4 for tablet, 2 for mobile) based on viewport and update rest number
                    of keywords beyond current maximum in Chip */}
          {/* ^ Nearly impossible thing for responsive markup rendered on server.
                Maybe just avoid conditional render? // oklimenko */}
          {pkg.registryMetadata?.keywords?.slice(6).map((tag) => (
            <a href='#' className={styles.tag}>
              {tag}
            </a>
          ))}
          {(pkg.registryMetadata?.keywords?.length ?? 0) > 6 && (
            <Chip variant='info' size='medium' fontWeight='semiBold'>
              +{(pkg.registryMetadata?.keywords?.length ?? 0) - 6}
            </Chip>
          )}
        </div>

        <div className={styles.author}>
          {/* TODO: print all maintainers? Author is not a single entity */}
          <span className={styles.authorName}>{pkg.registryMetadata?.maintainers?.[0].name}</span>
          <img
            className={styles.authorImage}
            src={pkg.registryMetadata?.maintainers?.[0].avatar}
            alt=''
          />
        </div>
      </div>
    </div>
  );
}
