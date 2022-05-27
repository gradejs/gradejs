import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendedPackageMetadata1653653200864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "package_metadata" add column "monthly_downloads" int;
      alter table "package_metadata" add column "description" text;
      alter table "package_metadata" add column "homepage_url" text;
      alter table "package_metadata" add column "repository_url" text;
      alter table "package_metadata" add column "license" text;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "package_metadata" drop column "monthly_downloads";
      alter table "package_metadata" drop column "description";
      alter table "package_metadata" drop column "homepage_url";
      alter table "package_metadata" drop column "repository_url";
      alter table "package_metadata" drop column "license";
    `);
  }
}
