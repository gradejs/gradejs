import { MigrationInterface, QueryRunner } from 'typeorm';

export class DataLayerRework1662077882511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "web_page_package";
    `);

    await queryRunner.query(`
      DROP TABLE "web_page";
    `);

    await queryRunner.query(`
      CREATE TABLE "hostname" (
        "id" serial primary key,
        "hostname" text not null
      );
      
      CREATE UNIQUE INDEX "hostname_hostname" ON "hostname" ("hostname");
    `);

    await queryRunner.query(`
      CREATE TABLE "web_page" (
        "id" serial primary key,
        "hostname_id" integer not null references "hostname"("id"),
        "path" text not null,
        "created_at" timestamp not null default now()
      );
      
      CREATE UNIQUE INDEX "web_page_hostname_id_path" ON "web_page" ("hostname_id", "path");
    `);

    await queryRunner.query(`
      CREATE TABLE "web_page_scan" (
        "id" serial primary key,
        "web_page_id" integer not null references "web_page"("id"),
        "status" text not null,
        "scan_result" jsonb default null,
        "created_at" timestamp not null default now(),
        "finished_at" timestamp
      );
      
      CREATE INDEX "web_page_scan_web_page_id_created_at" ON "web_page_scan" ("web_page_id", "created_at" DESC);
    `);

    await queryRunner.query(`
      CREATE TABLE "package_usage_by_hostname_projection" (
        "id" serial primary key,
        "hostname_id" integer not null references "hostname"("id"),
        "source_scan_id" integer not null references "web_page_scan"("id"),
        "package_name" text not null,
        "package_version_set" jsonb not null default '[]'
      );
      
      CREATE INDEX "package_usage_by_hostname_projection_package_name" ON "package_usage_by_hostname_projection" ("package_name");
    `);

    await queryRunner.query(`
      CREATE TABLE "scans_with_vulnerabilities_projection" (
        "id" serial primary key,
        "source_scan_id" integer not null references "web_page_scan"("id"),
        "vulnerabilities" jsonb not null,
        "created_at" timestamp not null default now()
      );
      
      CREATE INDEX "scans_with_vulnerabilities_projection_created_at" ON "scans_with_vulnerabilities_projection" ("created_at" DESC);
    `);

    await queryRunner.query(`
      CREATE MATERIALIZED VIEW "package_popularity_view" AS
        SELECT
        "package_usage"."package_name" AS "package_name",
         count(DISTINCT "package_usage"."hostname_id") as "usage_by_hostname_count",
         (SELECT jsonb_agg(r)
           FROM (
             SELECT "package_version", count("package_version")
             FROM
               "package_usage_by_hostname_projection" as "package_usage_subquery",
               jsonb_array_elements_text("package_usage_subquery"."package_version_set") AS "package_version"
             WHERE "package_usage_subquery"."package_name" = "package_usage"."package_name"
             GROUP BY "package_version"
           ) as r
         ) as version_popularity
      FROM
        "package_usage_by_hostname_projection" as "package_usage"
      GROUP BY "package_usage"."package_name";
        
      CREATE INDEX "package_popularity_view_usage_by_hostname_count" ON "package_popularity_view" ("usage_by_hostname_count" DESC);
      CREATE INDEX "package_popularity_view_package_name" ON "package_popularity_view" ("package_name" DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP MATERIALIZED VIEW "package_popularity_view";
    `);

    await queryRunner.query(`
      DROP TABLE "hostname", "web_page", "web_page_scan", "package_usage_by_hostname_projection", "scans_with_vulnerabilities_projection" cascade;
    `);

    await queryRunner.query(`
      CREATE TABLE "web_page" (
        "id" serial primary key,
        "hostname" text not null,
        "url" text not null,
        "status" text not null,
        "updated_at" timestamp not null default now(),
        "created_at" timestamp not null default now()
      );

      CREATE UNIQUE INDEX "web_page_url_index" ON "web_page" ("url");
    `);

    await queryRunner.query(`
      create table "web_page_package" (
        "id" serial primary key,
        "hostname" text not null,
        "latest_url" text not null,
        "package_name" text not null,
        "possible_package_versions" jsonb not null default '[]',
        "package_version_range" text not null,
        "package_metadata" jsonb,
        "updated_at" timestamp not null default now(),
        "created_at" timestamp not null default now()
      );

      CREATE UNIQUE INDEX "web_page_package_hostname_package_name_index" ON "web_page_package" ("hostname", "package_name");
    `);
  }
}
