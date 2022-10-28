import { PackageRequest } from '../systemApi/api';

export type WorkerTask = {
  [Key in WorkerTaskType]: {
    type: Key;
    payload: WorkerTaskPayloadMap[Key];
  };
}[WorkerTaskType];

export type WorkerTaskType = keyof WorkerTaskPayloadMap;

export type WorkerTaskPayloadMap = {
  syncHostnameRanking: undefined;
  syncPackageIndex: undefined;
  syncPackageIndexBatch: PackageRequest[];
  syncPackageVulnerabilities: undefined;
  updateSitemap: string[];
};
