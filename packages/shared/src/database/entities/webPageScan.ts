import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { WebPage } from './webPage';
import { DetectedPackage } from '../../internalApi/api';

@Entity({ name: 'web_page_scan' })
@Index(['web_page_id', 'created_at'])
export class WebPageScan extends BaseEntity {
  @PrimaryColumn({ type: 'bigint', generated: 'increment' })
  id!: number;

  @ManyToOne(() => WebPage, (webPage) => webPage.scans)
  @JoinColumn({ name: 'web_page_id', referencedColumnName: 'id' })
  webPage!: WebPage;

  @RelationId((self: WebPageScan) => self.webPage)
  webPageId!: number;

  @Column()
  status!: WebPageScan.Status;

  @Column({ type: 'jsonb' })
  scanResult?: ScanResult;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  finishedAt?: Date;
}

export namespace WebPageScan {
  export enum Status {
    Pending = 'pending',
    Processed = 'processed',
    Unsupported = 'unsupported',
    Protected = 'protected',
    Failed = 'failed',
  }
}

export type ScanResultPackage = DetectedPackage;

export type ScanResult = {
  packages: ScanResultPackage[];
};
