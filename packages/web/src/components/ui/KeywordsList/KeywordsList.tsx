import React, { useMemo } from 'react';
import clsx from 'clsx';
import styles from '../SidebarCategory/SidebarCategory.module.scss';
import Chip from '../Chip/Chip';
import ChipGroup from '../ChipGroup/ChipGroup';

type Props = {
  keywordsList: string[];
  selectedKeywords: string[];
  selectHandler: (newKeywords: string[]) => void;
};

// TODO: onChange Perf fixes
export default function KeywordsList({ keywordsList, selectedKeywords, selectHandler }: Props) {
  const displayedKeywords = useMemo(() => {
    const initialBatch = keywordsList.slice(0, 6);
    const selectedBatch = selectedKeywords.filter((it) => !initialBatch.includes(it));

    return [...initialBatch, ...selectedBatch];
  }, [keywordsList, selectedKeywords]);

  return (
    <ChipGroup>
      {displayedKeywords.map((keyword) => (
        <Chip
          key={keyword}
          title={keyword}
          className={clsx(selectedKeywords.includes(keyword) && styles.sidebarChipActive)}
          onClick={() =>
            selectHandler(
              selectedKeywords.includes(keyword)
                ? selectedKeywords.filter((it) => it !== keyword)
                : [...selectedKeywords, keyword]
            )
          }
          font='monospace'
        >
          {keyword}
        </Chip>
      ))}
    </ChipGroup>
  );
}
