import {
  Column,
  Entity,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
  Index,
} from 'typeorm';
import { WebPage } from './webPage';
import { DetectedPackage } from '../../systemApi/api';

@Entity({ name: 'web_page_scan' })
@Index(['webPage', 'createdAt'])
export class WebPageScan extends BaseEntity {
  @PrimaryColumn({ type: 'bigint', generated: 'increment' })
  id!: number; // TODO: TypeORM breaks bigint by randomly returning number or string representations

  @ManyToOne(() => WebPage, (webPage) => webPage.scans)
  @JoinColumn({ name: 'web_page_id', referencedColumnName: 'id' })
  webPage!: WebPage;

  @RelationId((self: WebPageScan) => self.webPage)
  webPageId!: number;

  @Column()
  status!: WebPageScan.Status;

  @Column({ type: 'jsonb' })
  scanResult?: WebPageScan.Result;

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

  export type Package = DetectedPackage;
  export type Result = {
    packages: Package[];
  };
}
