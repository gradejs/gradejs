import clsx from 'clsx';
import { Icon } from 'components/ui/Icon/Icon';
import ProblemBadge from 'components/ui/ProblemBadge/ProblemBadge';
import React from 'react';
import { IdentifiedPackage } from 'types';
import styles from './PackagePreviewHeader.module.scss';

type Props = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  pkg: IdentifiedPackage;
  opened?: boolean;
};

export function PackagePreviewHeader({ onClick, opened, pkg }: Props) {
  return (
    <div className={styles.header} onClick={onClick}>
      <div className={styles.top}>
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
        <button type='button' className={styles.arrowWrapper}>
          <Icon
            kind='chevronDown'
            width={12}
            height={7}
            color='#8E8AA0'
            className={clsx(styles.arrow, { [styles.arrowOpened]: opened })}
          />
        </button>
      </div>

      {pkg.registryMetadata?.description && (
        <div className={styles.desc}>{pkg.registryMetadata?.description}</div>
      )}
    </div>
  );
}
