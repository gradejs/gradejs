import { ClientApi } from '@gradejs-public/public-api/src/clientApiRouter';

export type IdentifiedPackage = ClientApi.ScanResultPackageResponse & {
  approximateByteSize?: number;
  outdated?: boolean;
  vulnerable?: boolean;
  duplicate?: boolean;
  version?: string;
  containingScripts?: string[];
  modules: ClientApi.IdentifiedModule[];
  vulnerabilities: ClientApi.PackageVulnerabilityResponse[];
};
