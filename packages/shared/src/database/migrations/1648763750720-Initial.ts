import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1648763750720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "web_page" (
        "id" serial primary key,
        "hostname" text not null,
        "url" text not null,
        "status" text not null,
        "updated_at" timestamp,
        "created_at" timestamp
      );

      create unique index "web_page_url_index" on "web_page" ("url");

      create table "web_page_package" (
        "id" serial primary key,
        "hostname" text not null,
        "latest_url" text not null,
        "package" text not null,
        "updated_at" timestamp,
        "created_at" timestamp
      );

      create unique index "web_page_package_hostname_package_index" on "web_page_package" ("hostname", "package");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists web_page;
      drop table if exists web_page_package;
    `);
  }
}
