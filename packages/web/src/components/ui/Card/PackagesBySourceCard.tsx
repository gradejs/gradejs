import React from 'react';
import styles from './Card.module.scss';
import Card from './Card';
import Chip from '../Chip/Chip';
import ChipGroup from '../ChipGroup/ChipGroup';
import { Link } from 'react-router-dom';

export type PackagesBySourceCardProps = {
  sourceTitle: string;
  sourceIcon: string;
  sourceUrl?: string;
  packages: string[];
  morePackagesCount?: number;
};

const PackagesBySourceCard = ({
  sourceTitle,
  sourceIcon,
  sourceUrl,
  packages,
  morePackagesCount,
}: PackagesBySourceCardProps) => (
  <Card title={sourceTitle} icon={sourceIcon} to={sourceUrl}>
    <div className={styles.tagsWrapper}>
      <ChipGroup>
        {packages.map((chip) => (
          <Link to={'/package/' + chip}>
            <Chip key={chip} title={chip} className={styles.chip} size='large' font='monospace'>
              {chip}
            </Chip>
          </Link>
        ))}

        {!!morePackagesCount && (
          <Chip className={styles.chip} size='large' variant='outlined'>
            +{morePackagesCount} packages
          </Chip>
        )}
      </ChipGroup>
    </div>
  </Card>
);

export default PackagesBySourceCard;
