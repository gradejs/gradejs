import {
  Column,
  Entity,
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  RelationId,
  Index,
} from 'typeorm';
import { Hostname } from './hostname';
import { WebPageScan } from './webPageScan';

@Entity({ name: 'web_page' })
@Index(['hostname', 'path'], { unique: true })
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
