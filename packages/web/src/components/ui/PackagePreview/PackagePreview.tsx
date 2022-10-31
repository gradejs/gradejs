import React, { useState } from 'react';
import styles from './PackagePreview.module.scss';
import clsx from 'clsx';
import { IdentifiedPackage } from 'types';
import { PackagePreviewFooter } from './PackagePreviewFooter/PackagePreviewFooter';
import { PackagePreviewHeader } from './PackagePreviewHeader/PackagePreviewHeader';
import { PackagePreviewExtended } from './PackagePreviewExtended/PackagePreviewExtended';

type Props = {
  opened?: boolean;
  detailsLoading?: boolean;
  pkg: IdentifiedPackage;
};

export default function PackagePreview({ opened, pkg }: Props) {
  const [isOpened, setOpened] = useState(opened);
  const toggleView = () => {
    setOpened(!isOpened);
  };

  return (
    <div className={clsx(styles.package, { [styles.open]: isOpened })}>
      <PackagePreviewHeader onClick={toggleView} opened={isOpened} pkg={pkg} />
      {isOpened && <PackagePreviewExtended pkg={pkg} />}
      <PackagePreviewFooter metadata={pkg.registryMetadata} />
    </div>
  );
}
