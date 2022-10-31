import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHostnameRank1666982934604 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table "hostname" add column "global_rank" int default null;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table "hostname" drop column "global_rank";
      `);
  }
}
