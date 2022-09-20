import React, { useState } from 'react';
import styles from './PackagePreview.module.scss';
import { Icon } from '../Icon/Icon';
import Chip from '../Chip/Chip';
import clsx from 'clsx';
import ChipGroup from '../ChipGroup/ChipGroup';
import SitesList from '../SitesList/SitesList';
import { CSSTransition } from 'react-transition-group';
import Button from '../Button/Button';
import {
  LicenceSkeleton,
  LinksSkeleton,
  RatingSkeleton,
  ScriptSkeleton,
} from './PackagePreviewSkeleton';
import ProblemBadge from '../ProblemBadge/ProblemBadge';
import { ChipGroupSkeleton } from '../ChipGroup/ChipGroupSkeleton';
import { SitesListSkeleton } from '../SitesList/SitesListSkeleton';
import BarChart from '../BarChart/BarChart';
import BarChartSkeleton from '../BarChart/BarChartSkeleton';
import { formatNumber } from 'utils/helpers';
import Hint from '../Tooltip/Hint';

type Problem = 'vulnerabilities' | 'duplicate' | 'outdated';

type ExternalLink = {
  href: string;
  kind: 'repository' | 'link' | 'npm';
  linkText?: string;
};

type Props = {
  name: string;
  version: string;
  desc: string;
  problems?: Problem[];
  keywords: string[];
  author: {
    name: string;
    image: string;
  };
  opened?: boolean;
  detailsLoading?: boolean;
};

// TODO: refactor this (decomposition, props, memoization, etc)
export default function PackagePreview({
  name,
  version,
  desc,
  problems,
  keywords,
  author,
  opened,
  detailsLoading = false,
}: Props) {
  const [open, setOpen] = useState<boolean>(opened ?? false);
  const [packageDetailsLoading, setPackageDetailsLoading] = useState<boolean>(detailsLoading);

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

  // TODO: Mock API data, remove later
  const externalLinks: ExternalLink[] = [
    { kind: 'repository', href: 'https://github.com/facebook/react/', linkText: 'Repository' },
    { kind: 'link', href: 'https://reactjs.org/', linkText: 'Homepage' },
    { kind: 'npm', href: 'https://www.npmjs.com/package/react' },
  ];

  // TODO: Mock API data, remove later
  const loadedData = {
    script: '/rsrc.php/v3id044/yu/l/en_US/yD2XaVkWQHO.js?_nc_x=Ij3Wp8lg5Kz',
    license: {
      title: 'MIT license',
      subtitle: 'freely distributable',
    },
    rating: {
      place: 385,
      rankingDelta: -4,
      out: 12842,
    },
    dependencies: ['art', 'create-react-class', 'loose-envify', 'scheduler'],
    packages: [
      {
        fill: 1,
        uses: 89912,
        moduleVersion: '21.3.0',
      },
      {
        fill: 0.8,
        uses: 67111,
        moduleVersion: '18.2.0',
        highlighted: true,
      },
      {
        fill: 0.7,
        uses: 44212,
        moduleVersion: '20.1.0',
      },
      {
        fill: 0.6,
        uses: 41129,
        moduleVersion: '18.0.0',
      },
      {
        fill: 0.5,
        uses: 40465,
        moduleVersion: '19.11.2',
      },
      {
        fill: 0.4,
        uses: 38907,
        moduleVersion: '8.1.2',
        vulnerabilities: true,
      },
    ],
    sites: [
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
    ],
    links: externalLinks,
  };

  const { script, license, rating, dependencies, packages, sites, links } = loadedData;

  return (
    <div className={clsx(styles.package, open && styles.open)}>
      <div className={styles.header}>
        <div className={styles.top} onClick={toggleOpen}>
          <div className={styles.title}>
            <span className={styles.name}>
              {name} <span className={styles.version}>{version}</span>
            </span>

            {problems && (
              <span className={styles.problems}>
                {problems.map((problem) => (
                  <ProblemBadge key={problem} problem={problem} />
                ))}
              </span>
            )}
          </div>

          <button type='button' className={styles.arrowWrapper} onClick={toggleOpen}>
            <Icon kind='arrowDown' width={14} height={8} color='#8E8AA0' className={styles.arrow} />
          </button>
        </div>

        <div className={styles.desc}>{desc}</div>
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
            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='script' color='#8E8AA0' className={styles.statIcon} />
                Script
              </div>
              {packageDetailsLoading ? (
                <ScriptSkeleton />
              ) : (
                <a href='#' className={styles.statLink} target='_blank' rel='noreferrer'>
                  {script}
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
                  <LicenceSkeleton />
                ) : (
                  <>
                    <div className={styles.statTitle}>{license.title}</div>
                    <div className={styles.statSubtitle}>{license.subtitle}</div>
                  </>
                )}
              </div>

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
                      {rating.place}

                      <div
                        className={clsx(
                          styles.statRating,
                          rating.rankingDelta > 0 ? styles.statRatingGreen : styles.statRatingRed
                        )}
                      >
                        <Icon
                          kind='ratingArrow'
                          width={12}
                          height={12}
                          className={styles.statRatingArrow}
                        />
                        {rating.rankingDelta}
                      </div>
                    </div>
                    <div className={styles.statSubtitle}>out of {formatNumber(rating.out)}</div>
                  </>
                )}
              </div>

              <div className={clsx(styles.stat, styles.statListItemLarge)}>
                <div className={styles.statHeader}>
                  <Icon kind='dependency' color='#8E8AA0' className={styles.statIcon} />
                  Dependencies
                </div>
                {packageDetailsLoading ? (
                  <ChipGroupSkeleton />
                ) : (
                  <ChipGroup>
                    {dependencies.map((dependency) => (
                      <Chip size='medium' fontSize='small' font='monospace'>
                        {dependency}
                      </Chip>
                    ))}
                  </ChipGroup>
                )}
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statHeader}>
                <Icon kind='graph' color='#8E8AA0' className={styles.statIcon} />
                Versions popularity by uses on sites
              </div>

              <div className={styles.popularity}>
                {packageDetailsLoading ? <BarChartSkeleton /> : <BarChart bars={packages} />}
              </div>
            </div>

            {/* TODO: add Modules treemap here */}

            <div className={styles.stat}>
              <div className={styles.statHeader}>Used on</div>

              {packageDetailsLoading ? (
                <SitesListSkeleton className={styles.usedOnList} />
              ) : (
                <SitesList sites={sites} className={styles.usedOnList} />
              )}
            </div>

            <div className={styles.actions}>
              <div className={styles.links}>
                {packageDetailsLoading ? (
                  <LinksSkeleton />
                ) : (
                  links.map(({ href, kind, linkText }) => (
                    <a
                      key={href}
                      href={href}
                      className={styles.link}
                      target='_blank'
                      rel='noreferrer'
                    >
                      <Icon
                        kind={kind}
                        width={kind !== 'npm' ? 16 : 32}
                        height={kind !== 'npm' ? 16 : 32}
                        color='#212121'
                        className={styles.linkIcon}
                      />
                      {linkText}
                    </a>
                  ))
                )}
              </div>

              <Button variant='arrow'>Details</Button>
            </div>
          </div>
        </div>
      </CSSTransition>

      <div className={styles.footer}>
        <div className={styles.tags}>
          {/* TODO: not sure how to conditionally render maximum number of keywords (e.g. 5 for
                    desktop, 3/4 for tablet, 2 for mobile) based on viewport and update rest number
                    of keywords beyond current maximum in Chip */}
          {keywords.slice(0, 5).map((keyword) => (
            <a key={keyword} href='#' className={styles.tag}>
              {keyword}
            </a>
          ))}
          {keywords.slice(5).length > 0 && (
            <Chip variant='info' size='medium' fontWeight='semiBold'>
              +{keywords.slice(5).length}
            </Chip>
          )}
        </div>

        <div className={styles.author}>
          <span className={styles.authorName}>{author.name}</span>
          <img className={styles.authorImage} src={author.image} alt='' />
        </div>
      </div>
    </div>
  );
}
