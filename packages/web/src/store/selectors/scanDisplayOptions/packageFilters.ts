import { PackageTrait } from '../../slices/scanDisplayOptions';
import { IdentifiedPackage } from '../../../types';

export type OptimizedPackageFilters = {
  keywords: Set<string>;
  authors: Set<string>;
  traits: Set<PackageTrait>;
};

type PackageFilterPredicate = (
  filters: OptimizedPackageFilters,
  pkg: IdentifiedPackage
) => boolean | undefined;

export const packageFilterPredicates: PackageFilterPredicate[] = [
  ({ keywords }, pkg) =>
    !!keywords.size &&
    (!pkg?.registryMetadata?.keywords?.length ||
      pkg?.registryMetadata?.keywords?.every((it) => !keywords.has(it))),
  ({ authors }, pkg) =>
    !!authors.size &&
    (!pkg?.registryMetadata?.maintainers?.length ||
      pkg?.registryMetadata?.maintainers?.every((it) => !authors.has(it.name))),
  ({ traits }, pkg) => traits.has('vulnerable') && !pkg.vulnerable,
  ({ traits }, pkg) => traits.has('outdated') && !pkg.outdated,
];
