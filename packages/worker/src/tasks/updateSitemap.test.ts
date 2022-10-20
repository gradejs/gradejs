import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { gunzipSync } from 'zlib';
import { updateSitemap } from './updateSitemap';

jest.mock('@aws-sdk/client-s3');

describe('task / updateSitemap', () => {
  it('should index new versions', async () => {
    process.env.PUBLIC_ROOT_URL = 'https://gradejs.com';
    process.env.AWS_S3_BUCKET = 'fpjs-dev-gradejs';

    await updateSitemap(['/test-1', '/test-2/']);

    const putObjectCalls = (PutObjectCommand as jest.Mock).mock.calls;

    expect(S3Client.prototype.send).toHaveBeenCalledTimes(1);
    expect(putObjectCalls).toHaveLength(1);

    const [[payload]] = putObjectCalls;
    const sitemap = gunzipSync(payload.Body).toString();

    expect(sitemap.replace(/\s/g, '')).toEqual(
      `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
          <url>
            <loc>https://gradejs.com/</loc>
            <changefreq>never</changefreq>
            <priority>1.0</priority>
          </url>
          <url>
            <loc>https://gradejs.com/test-1</loc>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
          </url>
          <url>
            <loc>https://gradejs.com/test-2/</loc>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
          </url>
        </urlset>
      `.replace(/\s/g, '')
    );
  });
});
