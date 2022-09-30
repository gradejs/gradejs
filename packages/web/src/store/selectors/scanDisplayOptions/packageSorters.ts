import { IdentifiedPackage } from '../websiteResults';
import { PackageSorter, PackageSortType } from '../../slices/scanDisplayOptions';

export const SeverityWeightMap: Record<string, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
  UNKNOWN: 0,
};

export const compareSeverities = (severityA = 'UNKNOWN', severityB = 'UNKNOWN') =>
  (SeverityWeightMap[severityA] ?? 0) - (SeverityWeightMap[severityB] ?? 0);

type PackageSorterComparator = (pkgA: IdentifiedPackage, pkgB: IdentifiedPackage) => number;

const packageSorterMap: Record<PackageSortType, PackageSorterComparator> = {
  severity: (pkgA, pkgB) => {
    const [pkgAHighestSeverity] = pkgA.vulnerabilities
      .map((it) => it.severity)
      .sort((a, b) => compareSeverities(b, a));

    const [pkgBHighestSeverity] = pkgB.vulnerabilities
      .map((it) => it.severity)
      .sort((a, b) => compareSeverities(b, a));

    return compareSeverities(pkgAHighestSeverity, pkgBHighestSeverity);
  },
  popularity: (pkgA, pkgB) => {
    return (
      (pkgA?.registryMetadata?.monthlyDownloads ?? 0) -
      (pkgB?.registryMetadata?.monthlyDownloads ?? 0)
    );
  },
};

export function sortPackagesByOptions(packages: IdentifiedPackage[], options: PackageSorter[]) {
  return packages.slice().sort((pkgA, pkgB) => {
    let sortDirection = 0;
    for (const sortOption of options) {
      const sorterFn = packageSorterMap[sortOption.by];
      sortDirection = sorterFn(pkgA, pkgB) * (sortOption.direction === 'DESC' ? -1 : 1);

      if (sortDirection !== 0) {
        break;
      }
    }

    return sortDirection;
  });
}