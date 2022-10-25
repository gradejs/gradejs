import fetch from 'node-fetch';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getAwsS3Bucket, getS3Client, systemApi } from '@gradejs-public/shared';

const S3_FAVICON_FOLDER_PREFIX = 'favicons';

export async function saveScanWebPageFavicon(
  scanUrl: URL,
  pageMetadata: systemApi.ScanReport.PageMetadata | undefined
) {
  if (!pageMetadata?.favicon) {
    return;
  }

  const faviconRequest = await fetch(pageMetadata.favicon);

  const faviconContentType = faviconRequest.headers.get('content-type') ?? undefined;
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
