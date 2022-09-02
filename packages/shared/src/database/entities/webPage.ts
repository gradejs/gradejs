import {
  Column,
  Entity,
  Index,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  RelationId,
} from 'typeorm';
import { Hostname } from './hostname';
import { WebPageScan } from '@gradejs-public/shared';

@Entity({ name: 'web_page' })
@Index(['hostname_id', 'path'], { unique: true })
export class WebPage extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @ManyToOne(() => Hostname, (hostname) => hostname.webPages)
  @JoinColumn({ name: 'hostname_id', referencedColumnName: 'id' })
  hostname!: Hostname;

  @RelationId((self: WebPage) => self.hostname)
  hostnameId!: number;

  @Column()
  path!: string;

  @OneToMany(() => WebPageScan, (webPageScan) => webPageScan.webPage)
  scans!: WebPageScan[];

  @CreateDateColumn()
  createdAt!: Date;
}
