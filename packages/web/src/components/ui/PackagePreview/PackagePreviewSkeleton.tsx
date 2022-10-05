import React from 'react';
import styles from './PackagePreview.module.scss';
import Skeleton from '../Skeleton/Skeleton';
import { repeat } from '../../../utils/helpers';

export const PackagePreviewSkeleton = () => (
  <Skeleton variant='rounded' className={styles.packageSkeleton} />
);

export const ScriptSkeleton = () => <Skeleton width={354} />;

export const LicenceSkeleton = () => (
  <>
    <Skeleton width={103} height={26} variant='rectangular' className={styles.statHeader} />
    <Skeleton width={135} />
  </>
);

export const FootprintSkeleton = () => (
  <>
    <Skeleton width={103} height={26} variant='rectangular' className={styles.statHeader} />
    <Skeleton width={135} />
  </>
);

export const RatingSkeleton = () => (
  <>
    <Skeleton width={62} height={26} variant='rectangular' className={styles.statHeader} />
    <Skeleton width={102} />
  </>
);

export const LinksSkeleton = () => (
  <>
    {repeat(
      3,
      <div className={styles.link}>
        <Skeleton width={18} height={18} className={styles.linkIcon} />
        <Skeleton width={80} />
      </div>
    )}
  </>
);
