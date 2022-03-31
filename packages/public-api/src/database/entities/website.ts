import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'website' })
@Index(['hostname'], { unique: true })
export class Website extends BaseEntity {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id!: number;

  @Column()
  hostname!: string;

  @Column()
  status!: Website.Status;

  @Column({ type: 'jsonb' })
  packages!: string[];

  @UpdateDateColumn()
  updatedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

export namespace Website {
  export enum Status {
    Pending = 'pending',
    Processed = 'processed',
    Unsupported = 'unsupported',
  }
}
