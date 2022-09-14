import { BaseEntity, Column, Index, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'package_popularity_view' })
@Index(['packageName'])
@Index(['usageByHostnameCount'])
export class PackagePopularityView extends BaseEntity {
  @Column()
  packageName!: string;

  @Column()
  usageByHostnameCount!: number;

  @Column({ type: 'jsonb' })
  versionPopularity!: PackageVersionPopularity;
}

type PackageVersionPopularity = Array<{ package_version: string; count: number }>;
