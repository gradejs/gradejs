import React from 'react';
import SidebarCategoryHeader from './SidebarCategoryHeader';

type Props = {
  categoryName: string;
  selectedKeywords?: string[];
  keywordsList?: string[];
  returnButton?: () => void;
  resetGroup?: () => void;
  children?: React.ReactNode;
};

export default function SidebarCategory({
  categoryName,
  selectedKeywords,
  returnButton,
  resetGroup,
  children,
}: Props) {
  return (
    <>
      <SidebarCategoryHeader
        returnButton={returnButton}
        categoryName={categoryName}
        selectedKeywords={selectedKeywords}
        resetGroup={resetGroup}
      />

      {children}
    </>
  );
}
