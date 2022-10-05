import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { WebPageScan } from './webPageScan';

@Entity({ name: 'scans_with_vulnerabilities_projection' })
@Index(['createdAt'])
export class ScansWithVulnerabilitiesProjection extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @ManyToOne(() => WebPageScan)
  sourceScan!: WebPageScan;

  @RelationId((self: ScansWithVulnerabilitiesProjection) => self.sourceScan)
  sourceScanId!: number;

  @Column({ type: 'jsonb' })
  vulnerabilities!: CompactVulnerabilityDescription[];

  @CreateDateColumn()
  createdAt!: Date;
}

export type CompactVulnerabilityDescription = {
  packageName: string;
  severity: string;
};
