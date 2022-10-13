import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../index';
import { ScanDisplayOptions } from '../../slices/scanDisplayOptions';
import { makeSelectScanPackagesByUrl } from '../websiteResults';
import { packageFilterPredicates } from './packageFilters';
import { sortPackagesByOptions } from './packageSorters';

export const DEFAULT_SCAN_DISPLAY_OPTIONS: ScanDisplayOptions = {
  searchText: '',
  packageFilters: {
    keywords: [],
    authors: [],
    traits: [],
  },
  packageSorters: [
    {
      by: 'severity',
      direction: 'DESC',
    },
    {
      by: 'popularity',
      direction: 'DESC',
    },
  ],
};

export const makeSelectScanDisplayOptions = () =>
  createSelector(
    [(state: RootState) => state.scanDisplayOptions, (_, scanUrl: string | undefined) => scanUrl],
    (scanDisplayOptions, scanUrl = '') =>
      scanDisplayOptions[scanUrl] ?? DEFAULT_SCAN_DISPLAY_OPTIONS
  );

export const makeSelectOptimizedScanDisplayOptions = () =>
  createSelector([makeSelectScanDisplayOptions()], (displayOptions) => {
    return {
      ...displayOptions,
      packageFilters: {
        keywords: new Set(displayOptions.packageFilters.keywords),
        authors: new Set(displayOptions.packageFilters.authors),
        traits: new Set(displayOptions.packageFilters.traits),
      },
    };
  });

export const makeSelectSortedAndFilteredScanPackages = () =>
  createSelector(
    [makeSelectScanPackagesByUrl(), makeSelectOptimizedScanDisplayOptions()],
    (packages = [], displayOptions) => {
      const { searchText, packageFilters, packageSorters } = displayOptions;

      const searchValue = searchText.toLowerCase();

      const matchedPackages = packages.filter((pkg) => {
        return (
          pkg.name.toLowerCase().includes(searchValue) ||
          pkg?.registryMetadata?.keywords?.includes(searchValue) ||
          pkg?.registryMetadata?.description?.toLowerCase().includes(searchValue)
        );
      });

      const filteredPackages = matchedPackages.filter((pkg) =>
        packageFilterPredicates.every((predicate) => !predicate(packageFilters, pkg))
      );

      return sortPackagesByOptions(filteredPackages, packageSorters);
    }
  );
