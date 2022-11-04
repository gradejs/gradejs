import { MigrationInterface, QueryRunner } from 'typeorm';

export class FulltextSearchIndexes1667551928553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
        
        CREATE INDEX "hostname_hostname_trgm" ON "hostname" USING gin ("hostname" gin_trgm_ops);
        CREATE INDEX "package_popularity_view_package_name_trgm" ON "package_popularity_view" USING gin ("package_name" gin_trgm_ops);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "hostname_hostname_trgm";
        DROP INDEX "package_popularity_view_package_name_trgm";
    `);
  }
}
