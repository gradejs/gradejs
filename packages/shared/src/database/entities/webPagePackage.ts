import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PackageMetadata } from './packageMetadata';

export type WebPagePackageMetadata = {
  approximateByteSize?: number;
};

@Entity({ name: 'web_page_package' })
@Index(['hostname', 'packageName'], { unique: true })
export class WebPagePackage extends BaseEntity {
  @PrimaryColumn({ type: 'int', generated: 'increment' })
  id!: number;

  @Column()
  hostname!: string;

  @Column()
  latestUrl!: string;

  @Column()
  packageName!: string;

  @Column({ type: 'jsonb' })
  possiblePackageVersions!: string[];

  @Column()
  packageVersionRange!: string;

  @Column({ type: 'jsonb' })
  packageMetadata?: WebPagePackageMetadata;

  @UpdateDateColumn()
  updatedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => PackageMetadata)
  @JoinColumn({ name: 'package_name', referencedColumnName: 'name' })
  registryMetadata?: PackageMetadata;
}
