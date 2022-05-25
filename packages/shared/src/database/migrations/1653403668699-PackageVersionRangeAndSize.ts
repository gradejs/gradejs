import { MigrationInterface, QueryRunner } from 'typeorm';

export class PackageVersionRangeAndSize1653403668699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "web_page_package" drop column "package";
      
      alter table "web_page_package" add column "package_name" text not null;
      alter table "web_page_package" add column "possible_package_versions" jsonb not null default '[]';
      alter table "web_page_package" add column "package_version_range" text not null;
      alter table "web_page_package" add column "package_metadata" jsonb;
      
      create unique index "web_page_package_hostname_package_name_index" on "web_page_package" ("hostname", "package_name");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "web_page_package" drop column "package_name";
      alter table "web_page_package" drop column "possible_package_versions";
      alter table "web_page_package" drop column "package_version_range";
      alter table "web_page_package" drop column "package_metadata";
      
      alter table "web_page_package" add column "package" text not null;
      
      create unique index "web_page_package_hostname_package_index" on "web_page_package" ("hostname", "package");
    `);
  }
}
