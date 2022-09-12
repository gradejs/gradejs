import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WebPage } from './webPage';

@Entity({ name: 'hostname' })
@Index(['hostname'], { unique: true })
export class Hostname extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column()
  hostname!: string;

  @OneToMany(() => WebPage, (webPage) => webPage.hostname)
  webPages?: WebPage[];
}
