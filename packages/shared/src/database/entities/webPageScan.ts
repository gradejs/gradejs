import { systemApi } from '@gradejs-public/shared';
import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WebPage } from './webPage';

@Entity({ name: 'web_page_scan' })
@Index(['webPage', 'createdAt'])
export class WebPageScan extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

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

  export type IdentifiedModule = systemApi.ScanReport.IdentifiedModule;
  export type IdentifiedPackage = systemApi.ScanReport.IdentifiedPackage;
  export type ProcessedScript = systemApi.ScanReport.ProcessedScript;
  export type IdentifiedBundler = systemApi.ScanReport.IdentifiedBundler;

  export type Result = {
    identifiedModuleMap: Record<string, IdentifiedModule>;
    identifiedPackages: IdentifiedPackage[];
    processedScripts: ProcessedScript[];
    identifiedBundler?: IdentifiedBundler;
  };
}
