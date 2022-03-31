import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1648763750720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "website" (
        "id" serial primary key,
        "hostname" text not null,
        "status" varchar(255) not null,
        "packages" jsonb not null default '[]',
        "updated_at" timestamp,
        "created_at" timestamp
      );

      create unique index "website_hostname_index" on "website" ("hostname");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      drop table if exists website;
    `);
  }
}
