import { SitemapStream } from 'sitemap';
import { createGzip } from 'zlib';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getAwsRegion, getAwsS3Bucket, getPublicRootUrl, logger } from '@gradejs-public/shared';

/**
 * Generates `sitemap.xml` and stores it on AWS S3
 * TODO:
 * - get paths from database entities
 * - use `<sitemapindex>` when we reach 50,000 urls
 */
export async function updateSitemap(paths: string[]) {
  try {
    const sitemap = await generateSitemap(paths);
    const s3client = new S3Client({ region: getAwsRegion() });
    const s3command = new PutObjectCommand({
      Body: sitemap,
      Bucket: getAwsS3Bucket(),
      Key: 'sitemaps/sitemap.xml.gz',
    });

    await s3client.send(s3command);
  } catch (e) {
    logger.error('Unexpected error during a sitemap update', e);
  }
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
