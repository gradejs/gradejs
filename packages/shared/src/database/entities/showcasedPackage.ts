import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PackageMetadata } from './packageMetadata';
import { PackagePopularityView } from './packagePopularityView';

@Entity({ name: 'showcased_package' })
@Index(['packageName'], { unique: true })
export class ShowcasedPackage extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column()
  displayOrder!: number;

  @Column()
  packageName!: string;

  /**
   * This is affected by https://github.com/typeorm/typeorm/issues/1668
   * use .leftJoinAndMapOne to bypass join column name bug
   */
  @ManyToOne(() => PackageMetadata, { persistence: false })
  @JoinColumn({ name: 'package_name', referencedColumnName: 'name' })
  packageMetadata!: PackageMetadata;

  @ManyToOne(() => PackagePopularityView, { persistence: false })
  @JoinColumn({ name: 'package_name', referencedColumnName: 'packageName' })
  packagePopularity?: PackagePopularityView;
}
