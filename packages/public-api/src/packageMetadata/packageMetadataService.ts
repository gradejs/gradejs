import { getDatabaseConnection, PackageMetadata } from '@gradejs-public/shared';

export async function getPackageMetadataByPackageNames(packageNames: string[]) {
  if (!packageNames.length) {
    return {};
  }

  const db = await getDatabaseConnection();
  const packageMetadataRepo = db.getRepository(PackageMetadata);

  const packageMetadataEntities = await packageMetadataRepo
    .createQueryBuilder('pm')
    .where('pm.name IN (:...packageNames)', { packageNames })
    .getMany();

  const packageMetadataMap = packageMetadataEntities.reduce((acc, val) => {
    acc[val.name] = val;

    return acc;
  }, {} as Record<string, PackageMetadata>);

  return packageMetadataMap;
}
