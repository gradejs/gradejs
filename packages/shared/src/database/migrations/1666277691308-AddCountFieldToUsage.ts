import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountFieldToUsage1666277691308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "package_usage_by_hostname_projection"
      add column "hostname_packages_count" int not null default 0;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      alter table "package_usage_by_hostname_projection"
      drop column "hostname_packages_count";
    `);
  }
}
