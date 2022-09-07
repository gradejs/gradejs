import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendPackageMetadata1662405581390 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table "package_metadata" add column "full_description" text;
        alter table "package_metadata" add column "maintainers" jsonb not null default '[]';
        alter table "package_metadata" add column "keywords" jsonb not null default '[]';
        alter table "package_metadata" add column "version_specific_values" jsonb not null default '{}';
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table "package_metadata" drop column "full_description";
        alter table "package_metadata" drop column "maintainers";
        alter table "package_metadata" drop column "keywords";
        alter table "package_metadata" drop column "version_specific_values";
      `);
  }
}
