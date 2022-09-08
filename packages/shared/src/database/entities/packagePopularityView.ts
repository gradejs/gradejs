import { BaseEntity, Column, Index, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'package_popularity_view' })
@Index(['packageName'])
@Index(['popularityRank'])
export class PackagePopularityView extends BaseEntity {
  @Column()
  packageName!: string;

  @Column()
  popularityRank!: number;

  @Column({ type: 'jsonb' })
  versionPopularity!: PackageVersionPopularity;
}

type PackageVersionPopularity = Array<{ package_version: string; count: number }>;
