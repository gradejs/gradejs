import { getDatabaseConnection, Hostname } from '@gradejs-public/shared';
import fetch from 'node-fetch';
import yauzl from 'yauzl';
import concurrently from 'tiny-async-pool';

/**
 * Ref: http://s3-us-west-1.amazonaws.com/umbrella-static/index.html
 */
const DATA_SOURCE = 'http://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip';
const POOL_LIMIT = 100;

export async function syncHostnameRanking() {
  const ranking = await fetchRanking();

  const connection = await getDatabaseConnection();
  const existingHostnames = await connection.getRepository(Hostname).find();

  // flush old rankings
  await connection.createQueryBuilder().update(Hostname).set({ globalRank: undefined }).execute();
  await concurrently(POOL_LIMIT, ranking, async ({ rank, hostname }) => {
    if (existingHostnames.some((it) => it.hostname === hostname)) {
      await connection
        .createQueryBuilder()
        .update(Hostname)
        .set({ globalRank: rank })
        .where('hostname = :hostname', { hostname })
        .orWhere('hostname LIKE :subdomain', { subdomain: `%.${hostname}` })
        .execute();
    }
  });
}

// TOOD: refactor as stream later
export async function fetchRanking() {
  return fetch(DATA_SOURCE)
    .then((response) => response.buffer())
    .then(
      (buffer) =>
        new Promise<yauzl.ZipFile>((resolve, reject) => {
          yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, reader) => {
            if (err) {
              reject(err);
            } else {
              resolve(reader);
            }
          });
        })
    )
    .then(
      (reader) =>
        new Promise<string>((resolve, reject) => {
          const chunks: Buffer[] = [];

          reader.readEntry();
          reader.on('error', reject);
          reader.on('entry', (entry) => {
            reader.openReadStream(entry, (err, stream) => {
              if (err) {
                reject(err);
                return;
              }

              stream.on('error', reject);
              stream.on('end', () => {
                resolve(Buffer.concat(chunks).toString());
              });
              stream.on('data', (chunk) => {
                chunks.push(chunk);
              });
            });
          });
        })
    )
    .then((csv) => {
      const lines = csv.split('\r\n');
      lines.pop(); // last line is empty
      return lines.map((it) => {
        const columns = it.split(',');
        return { rank: Number(columns[0]) || 0, hostname: columns[1] };
      });
    });
}
