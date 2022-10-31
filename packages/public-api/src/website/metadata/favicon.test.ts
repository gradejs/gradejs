import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { saveScanWebPageFavicon } from './favicon';
import fetch from 'node-fetch';

jest.mock('@aws-sdk/client-s3');
jest.mock('node-fetch');

const fetchMock = fetch as any as jest.Mock;
const { Response } = jest.requireActual('node-fetch');

beforeEach(() => {
  fetchMock.mockClear();
});

describe('website / metadata / favicon', () => {
  it('should save favicon', async () => {
    process.env.PUBLIC_ROOT_URL = 'https://gradejs.com';
    process.env.AWS_S3_BUCKET = 'fpjs-dev-gradejs';

    fetchMock.mockImplementation(
      async () =>
        new Response('test-data', {
          status: 200,
          headers: new Map([['content-type', 'image/svg+xml']]),
        })
    );

    await saveScanWebPageFavicon(new URL('https://test.gradejs.com'), {
      favicon: 'https://test.gradejs.com/favicon.svg',
    });

    const putObjectCalls = (PutObjectCommand as jest.Mock).mock.calls;

    expect(S3Client.prototype.send).toHaveBeenCalledTimes(1);
    expect(putObjectCalls).toHaveLength(1);

    const [[payload]] = putObjectCalls;

    expect(payload).toMatchObject({
      Body: Buffer.from('test-data'),
      ContentType: 'image/svg+xml',
      Key: 'favicons/test.gradejs.com',
    });
  });

  it('should not save favicon with improper type', async () => {
    process.env.PUBLIC_ROOT_URL = 'https://gradejs.com';
    process.env.AWS_S3_BUCKET = 'fpjs-dev-gradejs';

    fetchMock.mockImplementation(
      async () =>
        new Response('test-data', {
          status: 200,
          headers: new Map([['content-type', 'text/html']]),
        })
    );

    await saveScanWebPageFavicon(new URL('https://test.gradejs.com'), {
      favicon: 'https://test.gradejs.com/favicon.svg',
    });

    const putObjectCalls = (PutObjectCommand as jest.Mock).mock.calls;

    expect(S3Client.prototype.send).toHaveBeenCalledTimes(0);
    expect(putObjectCalls).toHaveLength(0);
  });

  it('should not save favicon without content-type', async () => {
    process.env.PUBLIC_ROOT_URL = 'https://gradejs.com';
    process.env.AWS_S3_BUCKET = 'fpjs-dev-gradejs';

    fetchMock.mockImplementation(
      async () =>
        new Response('test-data', {
          status: 200,
          headers: new Map(),
        })
    );

    await saveScanWebPageFavicon(new URL('https://test.gradejs.com'), {
      favicon: 'https://test.gradejs.com/favicon.svg',
    });

    const putObjectCalls = (PutObjectCommand as jest.Mock).mock.calls;

    expect(S3Client.prototype.send).toHaveBeenCalledTimes(0);
    expect(putObjectCalls).toHaveLength(0);
  });
});
