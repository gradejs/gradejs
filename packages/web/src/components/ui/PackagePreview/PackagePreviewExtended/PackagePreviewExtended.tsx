import React from 'react';
import styles from './PackagePreviewExtended.module.scss';
import { IdentifiedPackage } from 'types';
import { Icon } from 'components/ui/Icon/Icon';
import clsx from 'clsx';
import { getReadableSizeString, plural } from 'utils/helpers';
import ChipGroup from 'components/ui/ChipGroup/ChipGroup';
import Chip from 'components/ui/Chip/Chip';
import Vulnerabilities from 'components/ui/Vulnerabilities/Vulnerabilities';
import TreeMap from 'components/ui/TreeMap/TreeMap';
import { Link } from 'react-router-dom';
import Button from 'components/ui/Button/Button';
import { SitesListSkeleton } from 'components/ui/SitesList/SitesListSkeleton';
import Hint from 'components/ui/Tooltip/Hint';
import { usePackageInfo } from 'store/hooks/usePackageInfo';
import SitesList from 'components/ui/SitesList/SitesList';
import VersionPopularityChartSkeleton from 'components/ui/VersionPopularityChart/VersionPopularityChartSkeleton';
import VersionPopularityChart from 'components/ui/VersionPopularityChart/VersionPopularityChart';

type Props = {
  pkg: IdentifiedPackage;
};

export function PackagePreviewExtended({
  pkg: {
    name,
    version,
    modules,
    vulnerabilities,
    approximateByteSize,
    containingScripts,
    registryMetadata: metadata,
  },
}: Props) {
  const { packageInfo: extendedInfo, isLoading } = usePackageInfo(name) ?? {};

  const websitesUsedOn = extendedInfo?.usage?.slice(0, 4) ?? [];
  const versions = Object.keys(metadata?.versionSpecificValues ?? {});
  const dependencies = Object.keys(
    metadata?.versionSpecificValues?.[versions[versions.length - 1]]?.dependencies ?? {}
  );

  return (
    <div className={styles.container}>
      {!!containingScripts?.length && (
        <div className={styles.stat}>
          <div className={styles.statHeader}>
            <Icon kind='script' color='#8E8AA0' className={styles.statIcon} />
            Script
            <span className={styles.statTooltip}>
              <Hint text='Scripts containing modules of this package' />
            </span>
          </div>
          {containingScripts?.map((containingScript, index) => (
            <a
              key={index}
              href={containingScript}
              className={styles.statLink}
              target='_blank'
              rel='noreferrer'
            >
              {containingScript}
            </a>
          ))}
        </div>
      )}

      <div className={styles.statList}>
        {metadata?.license && (
          <div className={clsx(styles.stat, styles.statListItemSmall)}>
            <div className={styles.statHeader}>
              <Icon kind='license' color='#8E8AA0' className={styles.statIcon} />
              License
            </div>
            {/* TODO: license may be a big string! How we deal with it?*/}
            <div className={styles.statTitle}>{metadata?.license}</div>
            {/* TODO
              <div className={styles.statSubtitle}>
                {pkg.registryMetadata?.licenseDescription}
              </div>*/}
          </div>
        )}

        {!!approximateByteSize && (
          <div className={clsx(styles.stat, styles.statListItemSmall)}>
            <div className={styles.statHeader}>
              <Icon kind='weight' color='#8E8AA0' className={styles.statIcon} />
              Footprint
              <span className={styles.statTooltip}>
                <Hint text='Approximate package size based on matched modules' />
              </span>
            </div>
            <div className={styles.statTitle}>{getReadableSizeString(approximateByteSize)}</div>
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

        {dependencies.length > 0 && (
          <div className={clsx(styles.stat, styles.statListItemLarge)}>
            <div className={styles.statHeader}>
              <Icon kind='dependency' color='#8E8AA0' className={styles.statIcon} />
              {plural(dependencies.length, 'dependency', 'dependencies')}
            </div>

            <ChipGroup>
              {dependencies.map((dependency) => (
                <Chip key={dependency} title={dependency} size='medium' font='monospace'>
                  {dependency}
                </Chip>
              ))}
            </ChipGroup>
          </div>
        )}
      </div>

      {!!vulnerabilities?.length && (
        <div className={clsx(styles.stat, styles.statListItemNewLine)}>
          <div className={styles.statHeader}>
            <Icon kind='vulnerability' color='#8E8AA0' className={styles.statIcon} />
            Vulnerabilities
          </div>
          <Vulnerabilities vulnerabilities={vulnerabilities} />
        </div>
      )}

      {modules.length > 0 && (
        <div className={clsx(styles.stat, styles.statModules)}>
          <div className={styles.statHeader}>
            <Icon kind='modules' color='#8E8AA0' className={styles.statIcon} />
            Matched Modules
            <span className={styles.statTooltip}>
              <Hint text='On average GradeJS detects ~40% of bundled modules per package' />
            </span>
            {/*<span className={styles.statHeaderAdditional}>Matching 80%</span>*/}
          </div>

          <div className={styles.statModulesWrapper}>
            <TreeMap modules={modules} />
          </div>
        </div>
      )}

      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <Icon kind='graph' color='#8E8AA0' className={styles.statIcon} />
          Version distribution in production
          <span className={styles.statTooltip}>
            <Hint text='The number of websites using specific package version compared to detected version' />
          </span>
        </div>

        <div className={styles.popularity}>
          {isLoading ? (
            <VersionPopularityChartSkeleton />
          ) : (
            <VersionPopularityChart
              versionSpecificValues={extendedInfo?.versionSpecificValues ?? {}}
              highlightedVersionRange={version}
            />
          )}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.statHeader}>
          Also used on&nbsp;
          {!!extendedInfo?.usageByHostnameCount &&
            plural(extendedInfo.usageByHostnameCount, 'website', 'websites')}
        </div>

        {isLoading ? (
          <SitesListSkeleton className={styles.usedOnList} />
        ) : (
          <SitesList sites={websitesUsedOn} className={styles.usedOnList} />
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.links}>
          {metadata?.repositoryUrl && (
            <a
              href={metadata?.repositoryUrl}
              className={styles.link}
              target='_blank'
              rel='noreferrer'
            >
              <Icon kind='repository' color='#212121' className={styles.linkIcon} />
              Repository
            </a>
          )}

          {metadata?.homepageUrl && (
            <a
              href={metadata?.homepageUrl}
              className={styles.link}
              target='_blank'
              rel='noreferrer'
            >
              <Icon kind='link' color='#212121' className={styles.linkIcon} />
              Homepage
            </a>
          )}

          <a href={makeNpmUrl(name)} className={styles.link} target='_blank' rel='noreferrer'>
            <Icon kind='npm' width={30} height={13} color='#212121' className={styles.linkIcon} />
          </a>
        </div>

        <Link to={`/package/${name}`}>
          <Button variant='arrow'>More</Button>
        </Link>
      </div>
    </div>
  );
}

function makeNpmUrl(packageName: string) {
  return `https://www.npmjs.com/package/${packageName}`;
}
