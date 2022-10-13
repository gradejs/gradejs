import { SitemapStream } from 'sitemap';
import { createGzip } from 'zlib';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getAwsRegion, getAwsS3Bucket, getPublicRootUrl, logger } from '@gradejs-public/shared';

/**
 * Generates `sitemap.xml` and stores it on AWS S3
 * TODO:
 * - get paths from database entities
 * - use `<sitemapindex>` when we reach 50,000 urls
 */
export async function updateSitemap(paths: string[]) {
  const sitemap = createSitemapPipeline(paths);
  const s3client = new S3Client({ region: getAwsRegion() });
  const upload = new Upload({
    client: s3client,
    params: {
      Body: sitemap,
      Bucket: getAwsS3Bucket(),
      Key: 'sitemaps/sitemap.xml.gz',
    },
  });

  sitemap.on('error', (e) => {
    logger.error(e);
  });

  await upload.done();
}

const DEFAULT_PAGES = [{ url: '/', changefreq: 'never', priority: 1.0 }];

function createSitemapPipeline(paths: string[]) {
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

  sitemapStream.end();

  return sitemapStream.pipe(createGzip());
}
