import { WebPageScan } from './webPageScan';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'showcased_scan' })
export class ShowcasedScan extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column()
  displayOrder!: number;

  @ManyToOne(() => WebPageScan)
  scan!: WebPageScan;
}
