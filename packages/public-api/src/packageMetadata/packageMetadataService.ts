import { getDatabaseConnection, PackageMetadata } from '@gradejs-public/shared';

type Metadata = Omit<Omit<PackageMetadata, 'fullDescription'>, 'versionSpecificValues'>;

export async function getPackagePartialMetadataByPackageNames(
  packageNames: string[]
): Promise<Record<string, Metadata>> {
  if (!packageNames.length) {
    return {};
  }

  const db = await getDatabaseConnection();
  const packageMetadataRepo = db.getRepository(PackageMetadata);

  const packageMetadataEntities = await packageMetadataRepo
    .createQueryBuilder('pm')
    .where('pm.name IN (:...packageNames)', { packageNames })
    .getMany();

  return packageMetadataEntities.reduce((acc, val) => {
    acc[val.name] = val;
    return acc;
  }, {} as Record<string, Metadata>);
}
