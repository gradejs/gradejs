import { MigrationInterface, QueryRunner } from 'typeorm';

export class PackageMetadata1652619616121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      create table "package_metadata" (
          "id" serial primary key,
          "name" text not null,
          "latest_version" text not null,
          "update_seq" int not null,
          "updated_at" timestamp
      );

      create unique index "package_metadata_name_index" on "package_metadata" ("name");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table if exists package_metadata;
    `);
  }
}
