import { Column, Entity, Index, PrimaryColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'package_metadata' })
@Index(['name'], { unique: true })
export class PackageMetadata extends BaseEntity {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id!: number;

  @Column()
  name!: string;

  @Column()
  latestVersion!: string;

  @Column()
  updateSeq!: number;

  @Column()
  updatedAt!: Date;
}
