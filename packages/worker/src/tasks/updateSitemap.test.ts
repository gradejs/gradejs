import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import internal from 'stream';
import { createGunzip } from 'zlib';
import { updateSitemap } from './updateSitemap';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/lib-storage');

describe('task / updateSitemap', () => {
  it('should index new versions', async () => {
    process.env.PUBLIC_ROOT_URL = 'https://gradejs.com';
    process.env.AWS_S3_BUCKET = 'fpjs-dev-gradejs';

    await updateSitemap(['/test-1', '/test-2/']);

    const uploadCalls = (Upload as any as jest.Mock).mock.calls;
    expect(uploadCalls).toHaveLength(1);

    const [[payload]] = uploadCalls;
    expect(payload.client instanceof S3Client).toBeTruthy();

    const stream = payload.params.Body;
    const unzip = createGunzip();
    const pipeline = stream.pipe(unzip);
    const sitemap = await readStreamAsString(pipeline);

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

function readStreamAsString(stream: internal.Readable) {
  return new Promise<string>((resolve) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString()));
  });
}
