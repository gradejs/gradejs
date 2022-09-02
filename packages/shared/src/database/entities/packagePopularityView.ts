import { BaseEntity, Column, Index, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'package_popularity_view' })
@Index(['package_name'])
@Index(['popularity_rank'])
export class PackagePopularityView extends BaseEntity {
  @Column()
  packageName!: string;

  @Column()
  popularityRank!: number;

  @Column({ type: 'jsonb' })
  versionPopularity!: PackageVersionPopularity;
}

type PackageVersionPopularity = Record<string, number>;
