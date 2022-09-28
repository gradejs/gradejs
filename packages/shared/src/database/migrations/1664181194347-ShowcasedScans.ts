import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShowcasedScans1664181194347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "showcased_scan" (
        "id" serial primary key,
        "display_order" smallint not null default 0,
        "scan_id" integer not null references "web_page_scan"("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists "showcased_scan";
    `);
  }
}
