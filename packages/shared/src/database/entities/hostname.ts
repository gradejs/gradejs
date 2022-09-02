import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { WebPage } from './webPage';

@Entity({ name: 'hostname' })
@Index(['hostname'], { unique: true })
export class Hostname extends BaseEntity {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id!: number;

  @Column()
  hostname!: string;

  @OneToMany(() => WebPage, (webPage) => webPage.hostname)
  webPages?: WebPage[];
}
