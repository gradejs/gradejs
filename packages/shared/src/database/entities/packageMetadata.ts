import { Column, Entity, Index, PrimaryColumn, BaseEntity } from 'typeorm';

type Maintainer = {
  name: string;
  email: string;
  avatar: string;
};
type VersionData = { dependencies: Record<string, string>; unpackedSize?: number };

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
  monthlyDownloads!: number;

  @Column()
  description?: string;

  @Column()
  fullDescription?: string;

  @Column({ type: 'jsonb' })
  maintainers?: Maintainer[];

  @Column({ type: 'jsonb' })
  keywords?: string[];

  @Column({ type: 'jsonb' })
  versionSpecificValues?: Record<string, VersionData>;

  @Column()
  homepageUrl?: string;

  @Column()
  repositoryUrl?: string;

  @Column()
  license?: string;

  @Column()
  updateSeq!: number;

  @Column()
  updatedAt!: Date;
}
