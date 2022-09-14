import React from 'react';
import clsx from 'clsx';
import styles from '../SidebarCategory/SidebarCategory.module.scss';
import Chip from '../Chip/Chip';

type Props = {
  keywordsList: string[];
  selectedKeywords: string[];
  selectHandler: (keyword: string) => void;
};

export default function KeywordsList({ keywordsList, selectedKeywords, selectHandler }: Props) {
  return (
    <>
      {keywordsList.slice(0, 6).map((keyword) => (
        <Chip
          key={keyword}
          className={clsx(
            styles.sidebarChip,
            selectedKeywords.includes(keyword) && styles.sidebarChipActive
          )}
          onClick={() => selectHandler(keyword)}
          size='medium'
          font='monospace'
        >
          {keyword}
        </Chip>
      ))}
    </>
  );
}
