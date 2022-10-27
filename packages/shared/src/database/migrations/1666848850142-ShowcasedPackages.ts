import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShowcasedPackages1666848850142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "showcased_package" (
        "id" serial primary key,
        "display_order" smallint not null default 0,
        "package_name" text not null references "package_metadata"("name")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists "showcased_package";
    `);
  }
}
