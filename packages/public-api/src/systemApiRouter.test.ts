import {
  createSupertestApi,
  useDatabaseConnection,
  useTransactionalTesting,
} from '@gradejs-public/test-utils';
import { createApp } from './app';
import { getGradeJsApiKey, systemApi, WebPageScan } from '@gradejs-public/shared';
import * as WebsiteService from './website/service';
import { getRepository } from 'typeorm';

useDatabaseConnection();
useTransactionalTesting();

const api = createSupertestApi(createApp);

describe('routes / systemApi', () => {
  it('should deny requests without valid api key', async () => {
    await api.post('/system/scan').send().expect(401);
    await api.post('/system/scan').set('X-Api-Key', 'INVALID').send().expect(401);
  });

  it('should deny requests with invalid body', async () => {
    await api
      .post('/system/scan')
      .set('X-Api-Key', getGradeJsApiKey())
      .send({
        id: 'test',
        url: 'http://test.com',
        status: 'invalid',
      })
      .expect(400);
  });

  it('should process reported scans', async () => {
    const payload: systemApi.ScanReport = {
      requestId: 'test',
      url: 'http://test.com',
      status: systemApi.ScanReport.Status.Ready,
      identifiedModuleMap: {},
      identifiedPackages: [
        {
          name: 'react',
          versionSet: ['17.0.0'],
          moduleIds: [],
        },
      ],
    };

    const sencWebPageScanResultMock = jest.spyOn(WebsiteService, 'syncWebPageScanResult');
    sencWebPageScanResultMock.mockImplementation(async () => {
      return getRepository(WebPageScan).create({
        status: WebPageScan.Status.Processed,
      });
    });

    await api.post('/system/scan').set('X-Api-Key', getGradeJsApiKey()).send(payload).expect(204);

    expect(sencWebPageScanResultMock).toBeCalledWith(payload);
  });
});
