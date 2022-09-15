import { PackageRequest } from '../systemApi/api';

export type WorkerTask = {
  [Key in WorkerTaskType]: {
    type: Key;
    payload: WorkerTaskPayloadMap[Key];
  };
}[WorkerTaskType];

export type WorkerTaskType = keyof WorkerTaskPayloadMap;

export type WorkerTaskPayloadMap = {
  syncPackageIndex: undefined;
  syncPackageIndexBatch: PackageRequest[];
  syncPackageVulnerabilities: undefined;
};
