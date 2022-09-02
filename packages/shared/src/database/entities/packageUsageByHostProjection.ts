import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { Hostname } from './hostname';
import { WebPageScan } from '@gradejs-public/shared';

@Entity({ name: 'package_usage_by_hostname_projection' })
@Index(['package_name'])
export class PackageUsageByHostnameProjection extends BaseEntity {
  @PrimaryColumn({ type: 'bigint', generated: 'increment' })
  id!: number;

  @ManyToOne(() => Hostname)
  hostname!: Hostname;

  @ManyToOne(() => WebPageScan)
  sourceScan!: WebPageScan;

  @Column()
  packageName!: string;

  @Column({ type: 'jsonb' })
  packageVersionSet!: string[];
}
