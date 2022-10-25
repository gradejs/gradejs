import { SitemapStream } from 'sitemap';
import { createGzip } from 'zlib';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getAwsS3Bucket, getPublicRootUrl, getS3Client } from '@gradejs-public/shared';

/**
 * Generates `sitemap.xml` and stores it on AWS S3
 * TODO:
 * - get paths from database entities
 * - use `<sitemapindex>` when we reach 50,000 urls
 * - use `lib-storage` for a stream upload
 */
export async function updateSitemap(paths: string[]) {
  const sitemap = await generateSitemap(paths);
  const s3client = getS3Client();
  const s3command = new PutObjectCommand({
    Body: sitemap,
    Bucket: getAwsS3Bucket(),
    Key: 'sitemaps/sitemap.xml.gz',
  });

  await s3client.send(s3command);
}

const DEFAULT_PAGES = [{ url: '/', changefreq: 'never', priority: 1.0 }];

function generateSitemap(paths: string[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const sitemapStream = new SitemapStream({
      hostname: getPublicRootUrl(),
    });

    for (const page of DEFAULT_PAGES) {
      sitemapStream.write(page);
    }

    for (const path of paths) {
      sitemapStream.write({
        url: path,
        // TODO: reconsider changefreq later
        changefreq: 'weekly',
        priority: 1.0,
      });
    }

    const chunks: Buffer[] = [];
    const pipeline = sitemapStream.pipe(createGzip());

    pipeline.on('data', (chunk) => chunks.push(chunk));
    pipeline.on('error', (e) => reject(e));
    pipeline.on('end', () => resolve(Buffer.concat(chunks)));

    sitemapStream.end();
  });
}
