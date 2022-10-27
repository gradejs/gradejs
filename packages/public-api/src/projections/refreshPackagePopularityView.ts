import { getDatabaseConnection } from '@gradejs-public/shared';

export async function refreshPackagePopularityView() {
  const db = await getDatabaseConnection();

  return db.query(`REFRESH MATERIALIZED VIEW package_popularity_view;`);
}
