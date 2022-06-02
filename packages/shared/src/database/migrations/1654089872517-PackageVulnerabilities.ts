import { MigrationInterface, QueryRunner } from 'typeorm';

export class PackageVulnerabilities1654089872517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "package_vulnerability" (
          "id" serial primary key,
          "package_name" text not null,
          "package_version_range" text not null,
          "osv_id" text not null,
          "osv_data" jsonb not null
      );

      create unique index "package_vulnerability_package_name_osv_id" on "package_vulnerability" ("package_name", "osv_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists "package_vulnerability";
    `);
  }
}
