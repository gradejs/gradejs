import { MigrationInterface, QueryRunner } from 'typeorm';

export class PackageVersionRangeAndSize1653403668699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "web_page_package" add column "package_name" text;
      alter table "web_page_package" add column "possible_package_versions" jsonb not null default '[]';
      alter table "web_page_package" add column "package_version_range" text;
      alter table "web_page_package" add column "package_metadata" jsonb;
      
      update "web_page_package" set
        "package_name" = substring("package" from '^(.+)@.+$'),
        "package_version_range" = substring("package" from '^.+@(.+)$');
      
      alter table "web_page_package" alter column "package_name" set not null;
      alter table "web_page_package" alter column "package_version_range" set not null;

      create unique index "web_page_package_hostname_package_name_index" on "web_page_package" ("hostname", "package_name");
      
      alter table "web_page_package" drop column "package";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "web_page_package" add column "package" text;
      
      update "web_page_package" SET "package" = "package_name" || '@' || "package_version_range";
      
      alter table "web_page_package" alter column "package" set not null;
      
      create unique index "web_page_package_hostname_package_index" on "web_page_package" ("hostname", "package");
      
      alter table "web_page_package" drop column "package_name";
      alter table "web_page_package" drop column "possible_package_versions";
      alter table "web_page_package" drop column "package_version_range";
      alter table "web_page_package" drop column "package_metadata";
    `);
  }
}
