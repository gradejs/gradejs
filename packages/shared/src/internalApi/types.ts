export namespace Internal {
  export interface Website {
    id: number;
    url: string;
    status: WebsiteStatus;
    packages: string[];
    updatedAt: string;
    createdAt: string;
  }

  export enum WebsiteStatus {
    Created = 'created',
    InProgress = 'in-progress',
    Ready = 'ready',
    Failed = 'failed',
    Invalid = 'invalid',
  }
}
