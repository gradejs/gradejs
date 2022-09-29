import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShowcasedWebPages1664181194347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "showcased_web_page" (
        "id" serial primary key,
        "display_order" smallint not null default 0,
        "web_page_id" integer not null references "web_page"("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists "showcased_web_page";
    `);
  }
}
