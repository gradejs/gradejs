import { BaseEntity, Column, Index, JoinColumn, ManyToOne, ViewEntity } from 'typeorm';
import { PackageMetadata } from './packageMetadata';

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

  @ManyToOne(() => PackageMetadata, { persistence: false })
  @JoinColumn({ name: 'package_name', referencedColumnName: 'name' })
  packageMetadata!: PackageMetadata;
}

type PackageVersionPopularity = Array<{ package_version: string; count: number }>;
