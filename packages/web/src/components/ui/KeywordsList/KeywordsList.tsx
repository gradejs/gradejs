import React from 'react';
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
  return (
    <ChipGroup>
      {keywordsList.slice(0, 6).map((keyword) => (
        <Chip
          key={keyword}
          className={clsx(selectedKeywords.includes(keyword) && styles.sidebarChipActive)}
          onClick={() =>
            selectHandler(
              selectedKeywords.includes(keyword)
                ? selectedKeywords.filter((it) => it !== keyword)
                : [keyword, ...selectedKeywords]
            )
          }
          size='medium'
          font='monospace'
        >
          {keyword}
        </Chip>
      ))}
    </ChipGroup>
  );
}
