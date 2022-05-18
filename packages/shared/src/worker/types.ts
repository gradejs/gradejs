export type WorkerTask = {
  [Key in WorkerTaskType]: {
    type: Key;
    payload: WorkerTaskPayloadMap[Key];
  };
}[WorkerTaskType];

export type WorkerHandlers = {
  [Key in WorkerTaskType]: (payload: WorkerTaskPayloadMap[Key]) => Promise<unknown>;
};

export type WorkerTaskType = keyof WorkerTaskPayloadMap;

export type WorkerTaskPayloadMap = {
  pollNpmRegistryUpdates: undefined;
};
