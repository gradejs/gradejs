export interface WebsiteInternal {
  id: number;
  url: string;
  status: WebsiteStatusInternal;
  packages: string[];
  updatedAt: string;
  createdAt: string;
}

export enum WebsiteStatusInternal {
  Created = 'created',
  InProgress = 'in-progress',
  Ready = 'ready',
  Failed = 'failed',
  Invalid = 'invalid',
  Protected = 'protected',
}
