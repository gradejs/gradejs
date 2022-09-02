import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { WebPageScan } from '@gradejs-public/shared';

@Entity({ name: 'scans_with_vulnerabilities_projection' })
@Index(['web_page_id', 'created_at'])
export class ScansWithVulnerabilitiesProjection extends BaseEntity {
  @PrimaryColumn({ type: 'bigint', generated: 'increment' })
  id!: number;

  @ManyToOne(() => WebPageScan)
  sourceScan!: WebPageScan;

  @Column({ type: 'jsonb' })
  vulnerabilities!: CompactVulnerabilityDescription[];

  @CreateDateColumn()
  createdAt!: Date;
}

export type CompactVulnerabilityDescription = {
  affectedPackageName: string;
  severity: string;
};
