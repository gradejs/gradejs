import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'web_page' })
@Index(['url'], { unique: true })
export class WebPage extends BaseEntity {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id!: number;

  @Column()
  hostname!: string;

  @Column()
  url!: string;

  @Column()
  status!: WebPage.Status;

  @UpdateDateColumn()
  updatedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

export namespace WebPage {
  export enum Status {
    Pending = 'pending',
    Processed = 'processed',
    Unsupported = 'unsupported',
    Protected = 'protected',
  }
}
