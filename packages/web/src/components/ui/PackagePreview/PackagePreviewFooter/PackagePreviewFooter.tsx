import React from 'react';
import styles from './PackagePreviewFooter.module.scss';
import Chip from 'components/ui/Chip/Chip';
import { ClientApi } from 'services/apiClient';
import Avatar from 'components/ui/Avatar/Avatar';
import AvatarGroup from 'components/ui/AvatarGroup/AvatarGroup';

type RegistryMetadata = Exclude<ClientApi.ScanResultPackageResponse['registryMetadata'], undefined>;
type Props = {
  metadata?: Pick<RegistryMetadata, 'keywords' | 'maintainers'>;
};

/* TODO: not sure how to conditionally render maximum number of keywords (e.g. 5 for
 * desktop, 3/4 for tablet, 2 for mobile) based on viewport and update rest number
 * of keywords beyond current maximum in Chip.
 * Nearly impossible thing for responsive markup rendered on server.
 * Maybe just avoid conditional render? // oklimenko
 */
const KEYWORDS_DISPLAY_CAP = 5;

export function PackagePreviewFooter({ metadata = {} }: Props) {
  const { keywords = [], maintainers = [] } = metadata;

  if (keywords.length === 0 && maintainers.length === 0) {
    return null;
  }

  const visibleKeywords = keywords.slice(0, KEYWORDS_DISPLAY_CAP);
  const hiddenKeywordCount = keywords.length - KEYWORDS_DISPLAY_CAP;

  return (
    <div className={styles.footer}>
      <div className={styles.tags}>
        {visibleKeywords.map((tag) => (
          <a key={tag} href='#' className={styles.tag}>
            {tag}
          </a>
        ))}

        {hiddenKeywordCount > 0 && (
          <Chip variant='info' size='medium' fontWeight='semiBold'>
            +{hiddenKeywordCount}
          </Chip>
        )}
      </div>

      <div className={styles.author}>
        {maintainers.length === 1 ? (
          <>
            <span>{maintainers[0].name}</span>
            <span className={styles.authorImage}>
              <Avatar alt={maintainers[0].name} src={maintainers[0].avatar} />
            </span>
          </>
        ) : (
          <AvatarGroup>
            {maintainers.map((author) => (
              <Avatar key={author.name} alt={author.name} altAsTooltip={true} src={author.avatar} />
            ))}
          </AvatarGroup>
        )}
      </div>
    </div>
  );
}
