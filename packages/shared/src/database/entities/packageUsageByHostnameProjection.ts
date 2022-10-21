import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Hostname } from './hostname';
import { WebPageScan } from './webPageScan';

@Entity({ name: 'package_usage_by_hostname_projection' })
@Index(['packageName'])
export class PackageUsageByHostnameProjection extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @ManyToOne(() => Hostname)
  hostname!: Hostname;

  @RelationId((self: PackageUsageByHostnameProjection) => self.hostname)
  hostnameId!: number;

  @ManyToOne(() => WebPageScan)
  sourceScan!: WebPageScan;

  @RelationId((self: PackageUsageByHostnameProjection) => self.sourceScan)
  sourceScanId!: number;

  @Column()
  packageName!: string;

  @Column({ type: 'jsonb' })
  packageVersionSet!: string[];
}
