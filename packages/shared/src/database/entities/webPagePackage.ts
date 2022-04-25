import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'web_page_package' })
@Index(['hostname', 'package'], { unique: true })
export class WebPagePackage extends BaseEntity {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id!: number;

  @Column()
  hostname!: string;

  @Column()
  latestUrl!: string;

  @Column()
  package!: string;

  @UpdateDateColumn()
  updatedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
