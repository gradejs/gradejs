import fetch from 'node-fetch';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getAwsS3Bucket, getS3Client, systemApi } from '@gradejs-public/shared';

const S3_FAVICON_FOLDER_PREFIX = 'favicons';
const FAVICON_TIMEOUT = 20000;
const VALID_MIME_TYPES = ['image/png', 'image/jpeg', 'image/vnd.microsoft.icon', 'image/svg+xml'];
let abortController: AbortController;

export async function saveScanWebPageFavicon(
  scanUrl: URL,
  pageMetadata: systemApi.ScanReport.PageMetadata | undefined
) {
  if (!pageMetadata?.favicon) {
    return;
  }

  abortController = new AbortController();

  const faviconRequest = await Promise.race([
    fetch(pageMetadata.favicon, {
      headers: { Accept: VALID_MIME_TYPES.join(', ') },
      // TODO: remove ignores when typescript versions are synced
      /* eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error */
      // @ts-ignore note: node-fetch typings are incompatible
      signal: abortController.signal,
    }),
    new Promise<null>((resolve) => {
      setTimeout(() => {
        abortController.abort();
        resolve(null);
      }, FAVICON_TIMEOUT);
    }),
  ]);

  if (!faviconRequest) {
    return;
  }

  const faviconContentType = faviconRequest.headers.get('content-type') ?? undefined;
  if (!faviconContentType || !VALID_MIME_TYPES.includes(faviconContentType)) {
    return;
  }

  // TODO: Upload as stream. node-fetch stream interface conflicts with S3 one
  const faviconBody = await faviconRequest.buffer();

  const s3client = getS3Client();
  const s3command = new PutObjectCommand({
    Body: faviconBody,
    Bucket: getAwsS3Bucket(),
    Key: `${S3_FAVICON_FOLDER_PREFIX}/${scanUrl.hostname}`,
    ContentType: faviconContentType,
  });

  await s3client.send(s3command);
}
