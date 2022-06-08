import { getRepository } from 'typeorm';
import { WebPage, WebPagePackage, internalApi } from '@gradejs-public/shared';

export async function requestWebPageParse(url: string) {
  const [cached, internal] = await Promise.all([
    getRepository(WebPage).findOne({ url }),
    internalApi.initiateUrlProcessing(url),
    // Clear cached results
    getRepository(WebPagePackage).delete({ hostname: getHostnameFromUrl(url) }),
  ]);

  // Insert or update database entry
  return getRepository(WebPage).save({
    url: internal.url,
    hostname: getHostnameFromUrl(internal.url),
    status: mapInternalWebsiteStatus(internal.status),
    ...(cached ? { id: cached.id } : {}),
  });
}

export async function syncWebPage(webpage: WebPage) {
  // Skip sync for processed items
  if (webpage.status !== WebPage.Status.Pending) {
    return;
  }

  const internal = await internalApi.fetchUrlPackages(webpage.url);
  const nextStatus = mapInternalWebsiteStatus(internal.status);

  // Save updated status if changed
  if (webpage.status !== nextStatus) {
    webpage.status = nextStatus;
    await webpage.save();
  }

  // Save packages if ready
  if (webpage.status === WebPage.Status.Processed && internal.detectedPackages.length > 0) {
    await getRepository(WebPagePackage).upsert(
      internal.detectedPackages.map((pkg) => ({
        latestUrl: internal.url,
        hostname: getHostnameFromUrl(internal.url),
        packageName: pkg.name,
        possiblePackageVersions: pkg.possibleVersions,
        packageVersionRange: pkg.versionRange,
        packageMetadata: {
          approximateByteSize: pkg.approximateSize ?? undefined,
        },
      })),
      ['hostname', 'packageName']
    );
  }
}

export async function getWebPagesByHostname(hostname: string) {
  return getRepository(WebPage).find({ hostname });
}

export async function getPackagesByHostname(hostname: string) {
  return getRepository(WebPagePackage).find({
    relations: ['registryMetadata'],
    where: { hostname },
  });
}

function mapInternalWebsiteStatus(status: internalApi.WebsiteStatus) {
  switch (status) {
    case internalApi.WebsiteStatus.Invalid:
      return WebPage.Status.Unsupported;
    case internalApi.WebsiteStatus.InProgress:
      return WebPage.Status.Pending;
    case internalApi.WebsiteStatus.Protected:
      return WebPage.Status.Protected;
    default:
      return WebPage.Status.Processed;
  }
}

function getHostnameFromUrl(url: string) {
  return new URL(url).hostname;
}
