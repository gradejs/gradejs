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
import { useNavigate } from 'react-router-dom';

type Problem = 'vulnerabilities' | 'duplicate' | 'outdated';

type ExternalLink = {
  href: string;
  kind: 'repository' | 'link' | 'npm';
  linkText?: string;
};

type Props = {
  /*
  name: string;
  version: string;
  desc: string;
  problems?: Problem[];
  keywords: string[];
  author: {
    name: string;
    image: string;
  };
  */
  opened?: boolean;
  detailsLoading?: boolean;
  sites: Site[];
  flags: {
    vulnerable: boolean;
    duplicate: boolean;
    outdated: boolean;
  };
  pkg: {
    name: string;
    descriptionFull: string;
    containingScriptUrl: string;
    version: string;
    license: string;
    licenseDescription: string;
    rating: number;
    ratingDelta: number;
    deps: string[]; // TODO: probably not just string[]
    repositoryUrl?: string;
    homePageUrl?: string;
    npmUrl?: string;
    keywords: Array<{
      name: string;
    }>;
    author: {
      name: string;
      avatar: string;
    };
  };
  totalRatedPackages: number;
};

// TODO: refactor this (decomposition, props, memoization, etc)
export default function PackagePreview({
  /*  name,
      version,
      desc,
      problems,
      keywords,
      author,
      opened,
      detailsLoading = false,
      */
  opened,
  sites,
  flags,
  pkg,
  totalRatedPackages,
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

  //const { script, license, rating, dependencies, packages, sites, links } = loadedData;

  return (
    <div className={clsx(styles.package, open && styles.open)}>
      <div className={styles.header}>
        <div className={styles.top} onClick={toggleOpen}>
          <div className={styles.title}>
            <span className={styles.name}>
              {pkg.name} <span className={styles.version}>{pkg.version}</span>
            </span>

            {flags && ( // TODO deal with flags
              <span className={styles.problems}>
                {problems.map((problem) => (
                  <ProblemBadge key={problem} problem={problem} />
                ))}
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

        <div className={styles.desc}>{pkg.descriptionFull}</div>
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
                    <div className={styles.statTitle}>{pkg.license}</div>
                    <div className={styles.statSubtitle}>{pkg.licenseDescription}</div>
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

              <div className={clsx(styles.stat, styles.statListItemLarge)}>
                <div className={styles.statHeader}>
                  <Icon kind='dependency' color='#8E8AA0' className={styles.statIcon} />
                  Dependencies
                  {packageDetailsLoading ? (
                    <ChipGroupSkeleton />
                  ) : (
                    <ChipGroup>
                      {pkg.deps.map((dependency) => (
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
                    <>
                      {pkg.repositoryUrl && (
                        <a
                          href={pkg.repositoryUrl}
                          className={styles.link}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Icon kind='repository' color='#212121' className={styles.linkIcon} />
                          Repository
                        </a>
                      )}

                      {pkg.homePageUrl && (
                        <a
                          href={pkg.homePageUrl}
                          className={styles.link}
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Icon kind='link' color='#212121' className={styles.linkIcon} />
                          Homepage
                        </a>
                      )}

                      {pkg.npmUrl && (
                        <a
                          href={pkg.npmUrl}
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
                      )}
                    </>
                  )}
                </div>

                {/* TODO: should be a <a> link */}
                <Button variant='arrow' onClick={() => navigate('/package/' + pkg.name)}>
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
          {pkg.keywords.slice(6).map((tag) => (
            <a href='#' className={styles.tag}>
              {tag.name}
            </a>
          ))}
          {pkg.keywords.length > 6 && (
            <Chip variant='info' size='medium' fontWeight='semiBold'>
              +{pkg.keywords.length - 6}
            </Chip>
          )}
        </div>

        <div className={styles.author}>
          <span className={styles.authorName}>{pkg.author.name}</span>
          <img className={styles.authorImage} src={pkg.author.avatar} alt='' />
        </div>
      </div>
    </div>
  );
}
